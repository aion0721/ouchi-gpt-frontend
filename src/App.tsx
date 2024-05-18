import React, { useState } from "react";
import "./App.css";

interface Message {
  text: string;
  sender: "user" | "ai";
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // AIの応答をシミュレート（ここにAPI呼び出しを追加する）
    setTimeout(() => {
      const aiResponse: Message = {
        text: "This is a simulated AI response.",
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    }, 1000); // 1秒後にAIの応答を追加

    setInput("");
  };

  return (
    <div className="App">
      <header className="App-header">ChatAI App</header>
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default App;
