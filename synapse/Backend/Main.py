from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import spacy
import os
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq  
import re
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

nlp = spacy.load("en_core_web_sm")


load_dotenv()
GROQ_API_KEY = os.getenv("GOOGLE_API_KEY")

model = ChatGroq(model_name="llama3-8b-8192", groq_api_key=GROQ_API_KEY)

@app.route('/translate', methods=['POST'])
def translate_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files['file']
    target_lang = request.form.get('target_lang', 'hi')  
    
    try:
        with pdfplumber.open(file) as pdf:
            extracted_text = "".join(page.extract_text() + "\n" for page in pdf.pages if page.extract_text())
    except Exception as e:
        return jsonify({"error": "Error processing PDF file", "details": str(e)}), 500
    
    extract=[]
    doc = nlp(extracted_text)
    for token in doc:
        if token.is_punt:
            continue
        extract.append(token)

    extracted_text=' '.join(extract)

    try:
        prompt_template = PromptTemplate.from_template(
            "Translate the following text from English to {language}:\n\n{text}"
        )
        formatted_prompt = prompt_template.format(language=target_lang, text=extracted_text)
        translation_response = model.invoke(formatted_prompt)
        translated_text = translation_response.content
    except Exception as e:
        return jsonify({"error": "Error translating text", "details": str(e)}), 500

    print(translated_text)
    translated_text = re.sub(r'^.*?\n', '', translated_text, count=1)
    return jsonify({
        "original_text": extracted_text,
        "translated_text": translated_text
    })

if __name__ == '__main__':
    app.run(debug=True)
