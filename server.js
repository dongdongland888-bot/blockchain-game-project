const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Additional route for contract info
app.get('/contractInfo.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'contractInfo.json'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Blockchain Game DApp server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to play the game`);
  console.log('Press Ctrl+C to stop the server');
});