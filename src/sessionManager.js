import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";

import QRCode from "qrcode";
import path from "path";
import { randomUUID } from "crypto";

const sessions = new Map();

export async function createSession(phoneNumber = null) {
  const sessionId = randomUUID();

  const authPath = path.join(
    process.cwd(),
    "auth_info",
    sessionId
  );

  const { state, saveCreds } =
    await useMultiFileAuthState(authPath);

  const session = {
    id: sessionId,
    status: "connecting",
    qr: null,
    pairingCode: null,
    socket: null
  };

  sessions.set(sessionId, session);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  session.socket = sock;

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      session.qr = await QRCode.toDataURL(qr);
    }

    if (
      connection === "connecting" &&
      phoneNumber &&
      !session.pairingCode
    ) {
      try {
        const number = phoneNumber.replace(/\D/g, "");
        session.pairingCode =
          await sock.requestPairingCode(number);
      } catch (error) {
        console.error("Pairing error:",
