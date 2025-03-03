import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ScanCode from "./pages/ScanCode/ScanCode";
import Commands from "./pages/Commands/Commands";
import MainLayout from "./layouts/MainLayout";
import AddCommand from "./pages/Commands/AddCommand";
import Logs from "./pages/Logs/Logs";
import { WebSocketProvider } from "./context/WebSocketContext";

function App() {
  

  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path='/' element={<ScanCode />} />
          <Route path="/*" element={<MainLayout />}>
            <Route path="commands" element={<Commands />} />
            <Route path="commands/add" element={<AddCommand />} />
            <Route path="logs" element={<Logs />} />
          </Route>
        </Routes>
      </Router>
    </WebSocketProvider>
  );
}

export default App;
