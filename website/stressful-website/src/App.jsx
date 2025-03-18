import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('');
  const [uiState, setUiState] = useState('Default UI');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000');

    socket.onopen = () => {
      console.log('WebSocket connection opened')
    }

    socket.onmessage = (event) => {
      const { action, payload } = JSON.parse(event.data);
      console.log('Received message from WebSocket:', action, payload);

      // Update UI based on the received message
      if (action === 'UPDATE_UI') {
        setUiState(payload);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>{uiState}</h1>
      <p>Received message: {message}</p>
    </div>
  );
}

export default App
