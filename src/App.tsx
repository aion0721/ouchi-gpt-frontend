import React, { useState } from "react";
import axios from "axios";
import "./App.css";

interface Message {
  text: string;
  sender: "user" | "ai";
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://rp.local:8080/chat",
        { text: input },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const aiResponse: Message = { text: response.data.text, sender: "ai" };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorResponse: Message = {
        text: "Error fetching AI response.",
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        ChatAI App
        <button className="clear-button" onClick={handleClear}>
          Clear
        </button>
      </header>
      <div className="chat-container">
        <div className="chat-box">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
          {isLoading && <div className="message ai loading">Loading...</div>}
        </div>
        <div className="input-box">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
            disabled={isLoading}
            className={isLoading ? "disabled" : ""}
          />
          <button onClick={handleSend} disabled={isLoading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
