import { useEffect, useState } from "react";
import socket from "../services/socket";
import MainLayout from "../layout/MainLayout";

export default function ChatRoom() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.connect();

    socket.on("receive_message", data => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const payload = {
      text: message,
      sender: "Current User",
      timestamp: Date.now()
    };

    socket.emit("send_message", payload);

    setMessages(prev => [...prev, payload]);

    setMessage("");
  };

  return (
    <MainLayout>
      <h2>Campus Chat</h2>

      <div className="card">
        {messages.map((msg, i) => (
          <p key={i}>
            <strong>{msg.sender}</strong>: {msg.text}
          </p>
        ))}
      </div>

      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>
        Send
      </button>
    </MainLayout>
  );
}
