from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import google.generativeai as genai
from dotenv import load_dotenv
from pydantic import BaseModel
import json
from collections import defaultdict
from googletrans import Translator

translator = Translator()


load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')


app = FastAPI(title="Medical Chatbot API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

 
sample_patient_data = {
    "patient_id": "PAT123",
    "patient_name": "John Doe",
    "age": 45,
    "medical_history": {
        "conditions": ["Hypertension", "Type 2 Diabetes"],
        "allergies": ["Penicillin"],
        "previous_surgeries": ["Appendectomy"]
    },
    "current_symptoms": {
        "symptoms": ["Fatigue", "Fever"],
        "duration": "2 weeks"
    },
    "lab_results": {
        "blood_sugar": 200,
        "blood_pressure": "140/90",
        "cholesterol": 220
    },
    "diagnosis_prediction": {
        "possible_conditions": ["Uncontrolled Diabetes", "Possible Retinopathy"],
        "likelihood": {"Uncontrolled Diabetes": 0.85, "Possible Retinopathy": 0.6}
    },
    "explanation": "Patient presents with symptoms and lab results consistent with uncontrolled diabetes. Further evaluation for retinopathy is recommended."
}


session_store = defaultdict(lambda: model.start_chat(history=[]))



class PatientIdRequest(BaseModel):
    patientId: str


class ChatRequest(BaseModel):
    patientData: dict
    userMessage: str



@app.post("/api/load-patient-data")
async def load_patient_data(request: PatientIdRequest):
    if request.patientId == "PAT123":
        return sample_patient_data
    raise HTTPException(status_code=404, detail="Patient ID not found")


@app.post("/api/chat")
async def chat(request: ChatRequest):
    patient_data = request.patientData
    user_message = request.userMessage
    session_id = patient_data.get("patient_id", "unknown")

    
    detected_lang = translator.detect(user_message).lang  

  
    ai_query = f"""
    Here is the patient medical data in JSON format:
    {json.dumps(patient_data, indent=2)}

    The user asked: {user_message}
    Provide an answer that uses the provided patient data if applicable; if the question is general, provide general medical information.
    IMPORTANT: This response is for informational purposes only and should not be considered medical advice.
    """

    try:
        gemini_response = session_store[session_id].send_message(ai_query)
        response_text = gemini_response.text  

      
        translated_response = translator.translate(response_text, dest=detected_lang).text

        return {"response": translated_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Medical Chatbot API is running"}


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)