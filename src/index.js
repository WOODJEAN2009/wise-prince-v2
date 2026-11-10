import express from "express";
import {
  createSession,
  getSession
} from "./sessionManager.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

app.post("/api/session", async (req, res) => {
  try {
    const { phoneNumber } = req.body || {};
    const session = await createSession(phoneNumber);

    res.json({
      success: true,
      sessionId: session.id,
      status: session.status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Session creation failed"
    });
  }
});

app.get("/api/session/:id", (req, res) => {
  const session = getSession(req.params.id);

  if (!session) {
    return res.status(404).json({
      error: "Session not found"
    });
  }

  res.json({
    sessionId: session.id,
    status: session.status,
    qr: session.qr,
    pairingCode: session.pairingCode
  });
});

app.listen(PORT, () => {
  console.log(`WISE PRINCE running on port ${PORT}`);
});
