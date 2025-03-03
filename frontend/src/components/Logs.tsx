import {useEffect , useState } from "react";
import axios from "axios";

interface Log {
  id: number;
  sender: string;
  name: string;
  message: string;
  response: string;
  timestamp: string;
}

const API_URL = `${import.meta.env.VITE_API_URL}/logs`;

export default function Logs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);


  const fetchLogs = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Log Aktivitas Bot</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Waktu</th>
              <th className="border p-2">No Pengirim</th>
              <th className="border p-2">Nama Pengirim</th>
              <th className="border p-2">Pesan</th>
              <th className="border p-2">Response</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="border p-2">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="border p-2">{log.sender}</td>
                <td className="border p-2">{log.name}</td>
                <td className="border p-2">{log.message}</td>
                <td className="border p-2">{log.response}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
