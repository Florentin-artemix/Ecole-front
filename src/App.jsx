import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import ElevesPage from './pages/ElevesPage';
import CoursPage from './pages/CoursPage';
import NotesPage from './pages/NotesPage';
import BulletinPage from './pages/BulletinPage';
import UtilisateursPage from './pages/UtilisateursPage';
import ParentElevePage from './pages/ParentElevePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="eleves" element={<ElevesPage />} />
          <Route path="cours" element={<CoursPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="bulletins" element={<BulletinPage />} />
          <Route path="bulletins/:eleveId/:periode" element={<BulletinPage />} />
          <Route path="utilisateurs" element={<UtilisateursPage />} />
          <Route path="parent-eleve" element={<ParentElevePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
