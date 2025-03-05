import { createContext, useContext, useEffect, useState } from "react";

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL;

type WebSocketContextType = {
  isConnected: boolean;
  status: string;
  qrCode: string | null;
  setIsConnected: (status: boolean) => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Menghubungkan...");
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setStatus("Menunggu QR Code...");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "qr") {
        setQrCode(data.data);
        setStatus("Silakan scan QR Code dengan WhatsApp Anda.");
      } else if (data.type === "ready") {
        setStatus("WhatsApp terhubung!");
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
    <WebSocketContext.Provider value={{ isConnected, status, qrCode, setIsConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
