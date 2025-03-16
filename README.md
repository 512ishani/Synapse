# synapse-2.0
# MediVarta

## Overview
MediVarta is an AI-powered healthcare communication app that bridges the language gap between doctors and patients. By providing accurate **medical text translation** and an **intelligent chatbot**, MediVarta enhances accessibility and comprehension for users speaking various Indian languages.

## Features
### 🏥 **Seamless PDF Translation**
- Users can upload **prescription PDFs**, and the app extracts text using **pdfplumber**.
- Text is translated into multiple regional languages with **context-aware AI models (LLaMA via Groq)**.

### 🤖 **AI-Powered Chatbot**
- Integrated with **Gemini API**, enabling real-time **medical assistance**.
- Users can chat in their preferred **regional language** for **medication explanations, dosage guidance, and general health queries**.

### 📊 **Performance Metrics**
- **LLaMA Model:**
  - BLEU Score: **0.55 - 0.65**
  - METEOR Score: **0.70 - 0.80**
  - BERTScore F1: **0.85 - 0.92**
- **Gemini Model:**
  - BLEU Score: **0.65 - 0.75**
  - METEOR Score: **0.75 - 0.85**
  - BERTScore F1: **0.88 - 0.94**

## Challenges & Future Scope
### **Challenges**
- **Medical Translation Accuracy:** Direct translations of medical terms may cause confusion.
- **Chatbot Precision:** Errors in chatbot responses could lead to serious consequences.

### **Future Scope**
- **Handwritten Prescription Recognition:** Implementing **OCR (PyTesseract)** to process handwritten prescriptions.
- **Voice-Assisted Chatbot:** Integrating **speech recognition and synthesis** for an interactive experience.

## Contributors
- **Ishani Deshmukh**
- **Madhura Inamdar**
- **Sanjana Inapakolla**

## Demo & Resources
📌 **Demo Video:** [Watch Here](https://drive.google.com/file/d/1h9vsh8qkUteLLH4TCNQs_k06CLKEfbit/view?usp=sharing)
📌 **GitHub Repository:** [View Here](https://github.com/512ishani/Synapse)

---
**MediVarta – Empowering Healthcare Through AI & Language!**

