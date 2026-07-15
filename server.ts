import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const messagesFilePath = path.join(process.cwd(), "messages.json");

// Middleware to parse JSON
app.use(express.json());

// Helper to read messages
const readMessages = (): any[] => {
  try {
    if (fs.existsSync(messagesFilePath)) {
      const data = fs.readFileSync(messagesFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading messages file:", error);
  }
  return [];
};

// Helper to write messages
const writeMessages = (messages: any[]) => {
  try {
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing messages file:", error);
  }
};

// Contact API route
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "Semua field harus diisi!",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Format email tidak valid!",
    });
  }

  // Save message to simulated database (messages.json)
  const messages = readMessages();
  const newMessage = {
    id: Date.now().toString(),
    name,
    email,
    subject,
    message,
    timestamp: new Date().toISOString(),
  };
  messages.push(newMessage);
  writeMessages(messages);

  console.log("=== NEW CONTACT MESSAGE RECEIVED ===");
  console.log(`From: ${name} <${email}>`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  console.log("=====================================");

  // Simulate PHP mail sending successfully
  return res.json({
    success: true,
    message: "Pesan Anda berhasil dikirim secara aman ke terminal Imam Falahi (pma.media.jogja@gmail.com)!",
    data: newMessage,
  });
});

// Retrieve messages endpoint (secure decrypt viewing for demo/recruiter)
app.get("/api/messages", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader === "Bearer CYBER_COMPLIANCE_KEY_2026") {
    return res.json({
      success: true,
      data: readMessages(),
    });
  }
  return res.status(401).json({
    success: false,
    message: "Akses tidak sah!",
  });
});

// Start server and handle Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Cyber Server] running securely on http://localhost:${PORT}`);
  });
}

startServer();
