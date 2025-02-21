import { useEffect, useState } from "react";
import CommandForm from "./components/CommandForm";
import CommandList from "./components/CommandList";
import Logs from "./components/Logs";

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL;

function App() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState("Menghubungkan...");
  const [refresh, setRefresh] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setStatus("Menunggu QR Code...");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "qr") {
        setQrCode(data.data); // Set QR Code image
        setStatus("Silakan scan QR Code dengan WhatsApp Anda.");
      } else if (data.type === "ready") {
        setStatus("WhatsApp terhubung!");
        setQrCode(null); // Sembunyikan QR Code setelah terhubung
        setIsConnected(true);
      } else if (data.type === "authenticated") {
        setStatus("WhatsApp sudah diautentikasi!");
      } else if (data.type === "disconnected") {
        setStatus("WhatsApp terputus. Harap reload dan scan ulang.");
        setIsConnected(false);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setStatus("Terjadi kesalahan koneksi.");
    };


    return () => ws.close();
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">WhatsApp Bot</h1>
        <p className="mb-2">{status}</p>
        {qrCode && <img src={qrCode} alt="QR Code" className="border-2 border-gray-400 p-2 rounded" />}
      </div>
      {isConnected ? (
        <div className="min-h-screen p-4 bg-gray-100">
          <h1 className="text-2xl font-bold text-center mb-4">WhatsApp Bot Management</h1>
          <CommandForm onCommandAdded={() => setRefresh(!refresh)} />
          <CommandList key={refresh ? "refresh-true" : "refresh-false"} />
          <Logs />
        </div>
      ) : null}
    </>
  );
}

export default App;
