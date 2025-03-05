import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../context/WebSocketContext";

function ScanCode() {
    const { isConnected, status, qrCode } = useWebSocket();
    const navigate = useNavigate();

    useEffect(()=>{
        if (isConnected){
            navigate("/commands");
        }
    },[isConnected, navigate]);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <img src="/logo.jpeg" alt="logo.jpeg" className="w-16 h-16 object-cover rounded mb-2" />
        <h1 className="text-2xl font-bold mb-4">WhatsApp Bot</h1> 
        <p className="mb-2">{status}</p>
        {qrCode && <img src={qrCode} alt="QR Code" className="border-2 border-gray-400 p-2 rounded" />}
      </div>
    )
}

export default ScanCode