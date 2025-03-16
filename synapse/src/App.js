import React, { useState } from 'react';
import axios from 'axios';
import Chatbot from './components/Chatbot';

function App() {
  const [file, setFile] = useState(null);
  const [targetLang, setTargetLang] = useState('hi');
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleLanguageChange = (e) => {
    setTargetLang(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload a PDF file.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_lang', targetLang);

    try {
      const response = await axios.post('http://localhost:5000/translate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setOriginalText(response.data.original_text);
      setTranslatedText(response.data.translated_text);
    } catch (error) {
      console.error('Error:', error);
      alert('Error occurred while processing the PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px', backgroundColor: '#f0f8ff' }}>
      <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', background: '#fff', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#6b8e23', marginBottom: '20px' }}>MediVarta</h1>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '10px' }}>Upload Prescription PDF:
            <input type="file" accept=".pdf" onChange={handleFileChange} style={{ marginLeft: '10px' }} />
          </label>
          <label style={{ display: 'block', marginBottom: '10px' }}>Select Target Language:
            <select value={targetLang} onChange={handleLanguageChange} style={{ marginLeft: '10px', padding: '5px' }}>
              <option value="hindi">Hindi</option>
              <option value="bengali">Bengali</option>
              <option value="tamil">Tamil</option>
              <option value="telugu">Telugu</option>
              <option value="marathi">Marathi</option>
              <option value="gujarati">Gujarati</option>
              <option value="punjabi">Punjabi</option>
              <option value="malayalam">Malayalam</option>
              <option value="kannada">Kannada</option>
              <option value="odia">Odia</option>
            </select>
          </label>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} disabled={loading}>
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </form>
        {originalText && (
          <div style={{ marginTop: '20px' }}>
            <h2>Original Prescription</h2>
            <textarea readOnly value={originalText} rows="6" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}></textarea>
          </div>
        )}
        {translatedText && (
          <div style={{ marginTop: '20px' }}>
            <h2>Translated Prescription</h2>
            <textarea readOnly value={translatedText} rows="6" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}></textarea>
          </div>
        )}
      </div>
      
   
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#007BFF', color: 'white', padding: '10px 15px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px' }} onClick={() => setChatOpen(!chatOpen)}>
        📢 ChatBot 
      </div>
      
      
      {chatOpen && (
        <div style={{ position: 'fixed', bottom: '80px', right: '20px', width: '300px', background: 'white', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', padding: '10px' }}>
          <button style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '50%', cursor: 'pointer', float: 'right' }} onClick={() => setChatOpen(false)}>×</button>
          <Chatbot />
        </div>
      )}
    </div>
  );
}

export default App;
