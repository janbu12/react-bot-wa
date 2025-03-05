import {useEffect , useState } from "react";
import axios from "axios";
import Table from "./Table";

interface Log {
  id: number;
  sender: string;
  name: string;
  message: string;
  response: string;
  timestamp: string;
}

const API_URL = `${import.meta.env.VITE_API_URL}/logs`;

export default function LogsList() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const columns : {key:keyof Log; label: string}[]= [
    {key: "sender", label: "No Pengirim"},
    {key: "name", label: "Nama Pengirim"},
    {key: "message", label: "Pesan"},
    {key: "response", label: "Respon"},
    {key: "timestamp", label: "Waktu"},
  ];

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
    <div className="max-w-screen-xl mx-auto mt-5 px-4 pb-4">
      <h2 className="text-xl font-bold mb-4">Log Aktivitas Bot</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table
          columns={columns}
          data={logs}
        />
      )}
    </div>
  );
}
