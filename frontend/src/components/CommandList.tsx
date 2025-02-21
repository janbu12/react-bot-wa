import { useEffect, useState } from "react";
import axios from "axios";

interface Command {
  id: number;
  prefix: string;
  command: string;
  response: string;
  description?: string;
}

const API_URL = `${import.meta.env.VITE_API_URL}/commands`;

export default function CommandList() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCommand, setEditingCommand] = useState<Command | null>(null);

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setCommands(data);
    } catch (error) {
      console.error("Error fetching commands:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCommand = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus command ini?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCommands(commands.filter((cmd) => cmd.id !== id));
    } catch (error) {
      console.error("Error deleting command:", error);
    }
  };

  const updateCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCommand) return;

    try {
      await axios.put(`${API_URL}/${editingCommand.id}`, editingCommand);
      setEditingCommand(null);
      fetchCommands(); // Refresh daftar command
    } catch (error) {
      console.error("Error updating command:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Daftar Command Bot</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Prefix</th>
              <th className="border p-2">Command</th>
              <th className="border p-2">Response</th>
              <th className="border p-2">Deskripsi</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {commands.map((cmd) => (
              <tr key={cmd.id}>
                <td className="border p-2">{cmd.prefix}</td>
                <td className="border p-2">{cmd.command}</td>
                <td className="border p-2">{cmd.response}</td>
                <td className="border p-2">{cmd.description || "-"}</td>
                <td className="border p-2">
                  <button className="text-blue-500 mr-2" onClick={() => setEditingCommand(cmd)}>Edit</button>
                  <button className="text-red-500" onClick={() => deleteCommand(cmd.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingCommand && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold">Edit Command</h2>
            <form onSubmit={updateCommand} className="flex flex-col gap-3">
              <input
                type="text"
                value={editingCommand.prefix}
                onChange={(e) => setEditingCommand({ ...editingCommand, prefix: e.target.value })}
                className="border p-2"
              />
              <input
                type="text"
                value={editingCommand.command}
                onChange={(e) => setEditingCommand({ ...editingCommand, command: e.target.value })}
                className="border p-2"
              />
              <input
                type="text"
                value={editingCommand.response}
                onChange={(e) => setEditingCommand({ ...editingCommand, response: e.target.value })}
                className="border p-2"
              />
              <input
                type="text"
                value={editingCommand.description || ""}
                onChange={(e) => setEditingCommand({ ...editingCommand, description: e.target.value })}
                className="border p-2"
              />
              <div className="flex justify-end">
                <button type="button" onClick={() => setEditingCommand(null)} className="bg-gray-500 text-white p-2">Batal</button>
                <button type="submit" className="bg-blue-500 text-white p-2 ml-2">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
