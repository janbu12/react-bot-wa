import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/commands`;

export default function CommandForm({ onCommandAdded }: { onCommandAdded: () => void }) {
  const [prefix, setPrefix] = useState("!");
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, { prefix, command, response, description });
      setCommand("");
      setResponse("");
      setDescription("");
      onCommandAdded(); // Refresh daftar command
      navigate("/commands");
    } catch (error) {
      console.error("Error adding command:", error);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto mt-5">
      <h2 className="text-xl font-bold mb-4">Tambah Command Baru</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Prefix"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          className="border border-slate-200 p-2"
        />
        <input
          type="text"
          placeholder="Command"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="border border-slate-200 p-2"
        />
        <input
          type="text"
          placeholder="Response"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="border border-slate-200 p-2"
        />
        <textarea
          placeholder="Deskripsi (Opsional)"
          value={description}
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-slate-200 p-2"
        />
        <button type="submit" className="button-primary">Simpan</button>
      </form>
    </div>
  );
}
