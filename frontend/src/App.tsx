import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ScanCode from "./pages/ScanCode/ScanCode";
import Commands from "./pages/Commands/Commands";
import MainLayout from "./layouts/MainLayout";
import AddCommand from "./pages/Commands/AddCommand";

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path='/' element={<ScanCode />} />
        <Route path="/*" element={<MainLayout />}>
          <Route path="commands" element={<Commands />} />
          <Route path="commands/add" element={<AddCommand />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
