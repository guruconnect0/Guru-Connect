import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Bot, X } from "lucide-react";

import "./App.css";
export default function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    { id: "1", text: "Hi! I'm your AI Mentor. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
   const [theme, setTheme] = useState("light");

useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
}, [theme]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: "user" };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text })
      });

      const data = await res.json();
      setMessages(m => [...m, { id: Date.now()+1, text: data.reply, sender: "bot" }]);
    } catch {
      setMessages(m => [...m, { id: Date.now()+2, text: "Server not responding", sender: "bot" }]);
    }

    setTyping(false);
  };

  return (
    <>
    <nav>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
  {theme === "light" ? "🌙" : "☀️"}
</button>

    </nav>
      {isOpen && (
        <button className="chat-btn" onClick={() => setIsOpen(false)}>
          <MessageCircle /> Ask Mentor
        </button>
      )}

      {!isOpen && (
        <div className="chat-box">
          <div className="chat-header">
            <Bot /> AI Mentor <X onClick={() => setIsOpen(true)} />
          </div>

          <div className="chat-body">
            {messages.map(m => (
              <div key={m.id} className={m.sender}>{m.text.split("\n").map((line, i) => (
    <div key={i}>{line}</div>
  ))}</div>
            ))}
            {typing && <div className="bot">Typing...</div>}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="chat-input">
       
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask your mentor..." />
            <button onClick={send}><Send /></button>
          </div>
        </div>
      )}
    </>
  );
}
