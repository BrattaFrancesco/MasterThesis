import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {WebSocket, WebSocketServer} from 'ws'

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionSuccessStatus: 200,
  credentials: true
}
app.use(cors(corsOptions));

// Initialize WebSocket
const wss = new WebSocketServer({port:8000});

wss.on('connection', (ws) => {
  console.log('Client WebSocket connected.');
  global.socket = ws;

  ws.on('close', () => {
    console.log('WebSocket connection closed.');
  });
});

// Endpoint to receive messages
app.post('/send-message', (req, res) => {
  const { action, payload } = req.body;
  console.log('Message received:', action, payload);

  // Send event to websocket
  if (global.socket) {
    global.socket.send(JSON.stringify({ action, payload }));
  }

  res.status(200).json({ message: 'Message forwarded!' });
});

app.listen(PORT, () => {
  console.log(`onDemandUpdater listening on http://localhost:${PORT}`);
});
