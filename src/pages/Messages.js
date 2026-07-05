import { useState } from "react";
export default function Messages() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        text: message,
        sender: "You"
      }
    ]);

    setMessage("");
  };

  return (
    <>
      <h2>Messages</h2>

      <div className="card">
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.sender}: </strong>
            {m.text}
          </p>
        ))}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>
        Send
      </button>
    </>
  );
}
