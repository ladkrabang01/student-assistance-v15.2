import { createServer } from 'http';
import app from '../dist/index.js';

let server;

export default async (req, res) => {
  // Initialize server once
  if (!server) {
    server = createServer(app);
  }
  
  // Proxy the request to the Express app
  return new Promise((resolve, reject) => {
    server.emit('request', req, res);
    res.on('finish', resolve);
    res.on('error', reject);
  });
};
