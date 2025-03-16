import React, { useState } from "react";
import { uploadPDF } from "../api";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [translation, setTranslation] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file!");
            return;
        }
        const data = await uploadPDF(file);
        if (data) setTranslation(data);
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Upload a PDF for Translation</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} style={{ marginLeft: "10px" }}>Upload</button>

            {translation && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Original Text</h3>
                    <p>{translation.original_text}</p>
                    <h3>Translated Text</h3>
                    <p>{translation.translated_text}</p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;