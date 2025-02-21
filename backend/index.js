require("dotenv").config();
const express = require("express");
const { Server } = require("ws");
const cors = require("cors");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//ENDPOINT START

// Ambil semua command
app.get("/api/commands", (req, res) => {
    const commands = db.prepare("SELECT * FROM commands").all();
    res.json(commands);
  });
  
// Tambah command baru
app.post("/api/commands", (req, res) => {
const { prefix, command, response, description } = req.body;
const stmt = db.prepare("INSERT INTO commands (prefix, command, response, description) VALUES (?, ?, ?, ?)");
const result = stmt.run(prefix, command, response, description);
res.json({ id: result.lastInsertRowid, prefix, command, response, description });
});

// Update command
app.put("/api/commands/:id", (req, res) => {
const { prefix, command, response, description } = req.body;
const { id } = req.params;
const stmt = db.prepare("UPDATE commands SET prefix=?, command=?, response=?, description=? WHERE id=?");
stmt.run(prefix, command, response, description, id);
res.json({ id, prefix, command, response, description });
});

// Hapus command
app.delete("/api/commands/:id", (req, res) => {
const { id } = req.params;
const stmt = db.prepare("DELETE FROM commands WHERE id=?");
stmt.run(id);
res.json({ message: "Command deleted", id });
});

app.get("/api/logs", (req, res) => {
    const logs = db.prepare("SELECT * FROM logs ORDER BY timestamp DESC").all();
    res.json(logs);
});

// ENDPOINT END

const wss = new Server({ server });

// Inisialisasi WhatsApp client dengan sesi lokal
const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "./session" }),
});

wss.on("connection", (ws) => {
    console.log("New WebSocket connection");

    // Jika sesi sudah ada, kirim status "ready"
    client.getState().then((state) => {
        if (state === "CONNECTED") {
        ws.send(JSON.stringify({ type: "ready", message: "WhatsApp sudah terhubung!" }));
        }
    });

    // Kirim QR Code ke frontend saat diminta
    client.on("qr", (qr) => {
        console.log("QR RECEIVED", qr);
        qrcode.toDataURL(qr, (err, url) => {
            if (err) {
            console.error("Error generating QR Code:", err);
            return;
            }
            ws.send(JSON.stringify({ type: "qr", data: url }));
        });
    });

    client.on("ready", () => {
        console.log("WhatsApp is ready!");
        ws.send(JSON.stringify({ type: "ready", message: "WhatsApp is ready!" }));
    });

    client.on("authenticated", () => {
        console.log("WhatsApp authenticated!");
        ws.send(JSON.stringify({ type: "authenticated", message: "Authenticated!" }));
    });

    client.on("disconnected", (reason) => {
        console.log("WhatsApp disconnected:", reason);
        ws.send(JSON.stringify({ type: "disconnected", message: reason }));
    });

    client.on("message_create", async (msg) => {
        console.log("Received data:", msg);
        const chat = msg.body.trim().toLowerCase(); // Pastikan pesan dalam lowercase
        const sender = msg.from; // Nomor pengirim
        const nameSender = msg.notifyName || "Pengirim";
        console.log("Sender:", sender, "Name:", nameSender, "Message:", chat);

        // Cek apakah pesan dimulai dengan "!" dan tidak ada spasi setelahnya
        if (!chat.startsWith("!")) return;

        // Pisahkan prefix dan command
        const match = chat.match(/^(![^\s]+)(?:\s+(.*))?$/);
        if (!match) return;

        const [fullMatch, fullCommand, args] = match;
        const prefix = fullCommand.charAt(0); // Ambil karakter pertama sebagai prefix ("!")
        const command = fullCommand.slice(1); // Ambil teks setelah prefix sebagai command

        // Ambil command dari database berdasarkan prefix & command
        const storedCommand = db
            .prepare("SELECT * FROM commands WHERE prefix = ? AND command = ?")
            .get(prefix, command);

        console.log(storedCommand);

        if (storedCommand) {
            const responseMessage = await storedCommand.response.replace(/\{args\}/g, args || ""); // Jika tidak ada args, gunakan string kosong
            msg.reply(responseMessage);
    
            // Simpan log ke database
            db.prepare(
                "INSERT INTO logs (sender, name, message, response) VALUES (?, ?, ?, ?)"
            ).run(sender,nameSender, chat, responseMessage);
        }
    });
});

// Mulai WhatsApp client
client.initialize();
