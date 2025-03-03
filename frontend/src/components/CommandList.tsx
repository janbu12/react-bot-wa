import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
    <div className="max-w-screen-xl mx-auto mt-5">
      <div className="flex w-full justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Daftar Command Bot</h2>
        <Link to={"/commands/add"} className="button-primary px-3">Tambah Command</Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

          <table className="w-full text-sm text-left rtl:text-right text-gray-900">
            <thead className="text-xs text-white uppercase bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">Prefix</th>
                <th scope="col" className="px-6 py-3">Command</th>
                <th scope="col" className="px-6 py-3">Response</th>
                <th scope="col" className="px-6 py-3">Deskripsi</th>
                <th scope="col" className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {commands.map((cmd) => (
                <tr key={cmd.id} className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4">{cmd.prefix}</td>
                  <td className="px-6 py-4">{cmd.command}</td>
                  <td className="px-6 py-4">{cmd.response}</td>
                  <td className="px-6 py-4">{cmd.description || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 w-full">
                      <button className="button-primary w-full" onClick={() => setEditingCommand(cmd)}>Edit</button>
                      <button className="button-error w-full" onClick={() => deleteCommand(cmd.id)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingCommand && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg w-full sm:max-w-md">
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
                <button type="button" onClick={() => setEditingCommand(null)} className="button-error p-2">Batal</button>
                <button type="submit" className="button-primary p-2 ml-2">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
