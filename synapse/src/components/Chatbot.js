import React, { useState, useEffect } from "react";

const Chatbot = () => {
  const [patientData, setPatientData] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load patient data on first render
  useEffect(() => {
    fetch("http://localhost:8000/api/load-patient-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId: "PAT123" }),
    })
      .then((res) => res.json())
      .then((data) => setPatientData(data))
      .catch((err) => console.error("Error loading patient data:", err));
  }, []);

  // Send message to FastAPI
  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    const userChat = { sender: "User", text: message };
    setChat((prev) => [...prev, userChat]);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientData, userMessage: message }),
      });

      const data = await response.json();
      setChat((prev) => [...prev, { sender: "Bot", text: data.response }]);
    } catch (error) {
      console.error("Error in chat request:", error);
    }

    setMessage("");
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-semibold mb-3">🩺 Medical Chatbot</h2>
      <div className="border p-3 h-64 overflow-y-auto mb-3 bg-gray-100">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded-md ${
              msg.sender === "User" ? "bg-blue-200 text-right" : "bg-green-200"
            }`}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow border p-2 rounded-l-md"
          placeholder="Ask something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-r-md"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
