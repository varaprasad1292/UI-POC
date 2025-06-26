import React, { useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('wss://echo.websocket.events');
    setSocket(ws);

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, `Echo: ${event.data}`]);
    };

    ws.onopen = () => {
      setMessages((prev) => [...prev, '✅ WebSocket connected']);
    };

    ws.onerror = (err) => {
      setMessages((prev) => [...prev, '❌ WebSocket error']);
    };

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(msg);
      setMessages((prev) => [...prev, `You: ${msg}`]);
      setMsg('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Real-Time Chat</h2>
      <input value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button onClick={sendMessage}>Submit</button>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
