import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ScoreboardPage } from '@/pages/ScoreboardPage';
import { LoginPage } from '@/pages/LoginPage';
import { ControlCenterPage } from '@/pages/ControlCenterPage';

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/scoreboard" replace />}
        />

        <Route
          path="/scoreboard"
          element={<ScoreboardPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/controlcentre"
          element={
            <ProtectedRoute>
              <ControlCenterPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/scoreboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;