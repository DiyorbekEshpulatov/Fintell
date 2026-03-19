import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HujjatTahlili from './pages/HujjatTahlili';
import Integratsiyalar from './pages/Integratsiyalar';
import Katalog from './pages/Katalog';
import Inventarizatsiya from './pages/Inventarizatsiya';
import MoliyaviyHisobotlar from './pages/MoliyaviyHisobotlar';
import Maslahatchilar from './pages/Maslahatchilar';

function App() {
  return (
    <Router>
      <div className="flex">
        <nav className="w-64 h-screen bg-gray-800 text-white p-4">
          <ul>
            <li className="mb-2"><Link to="/hujjat-tahlili">Hujjat Tahlili</Link></li>
            <li className="mb-2"><Link to="/integratsiyalar">Integratsiyalar</Link></li>
            <li className="mb-2"><Link to="/katalog">Katalog</Link></li>
            <li className="mb-2"><Link to="/inventarizatsiya">Inventarizatsiya</Link></li>
            <li className="mb-2"><Link to="/moliyaviy-hisobotlar">Moliyaviy Hisobotlar</Link></li>
            <li className="mb-2"><Link to="/maslahatchilar">AI Maslahatchilar</Link></li>
          </ul>
        </nav>
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/hujjat-tahlili" element={<HujjatTahlili />} />
            <Route path="/integratsiyalar" element={<Integratsiyalar />} />
            <Route path="/katalog" element={<Katalog />} />
            <Route path="/inventarizatsiya" element={<Inventarizatsiya />} />
            <Route path="/moliyaviy-hisobotlar" element={<MoliyaviyHisobotlar />} />
            <Route path="/maslahatchilar" element={<Maslahatchilar />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
