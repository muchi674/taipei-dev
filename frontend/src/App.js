import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import NavHeader from "./components/NavHeader";
import Account from "./components/Account";
import { useBackendSetup } from "./hooks/useBackendSetup";
import { AuthContext } from "./context/AuthContext";

function App() {
  const signInStatus = useBackendSetup();

  return (
    <BrowserRouter>
      <AuthContext.Provider value={signInStatus}>
        <NavHeader />
        <main>
          <Routes>
            <Route path="/home" element={<h1>I'm Rick James, bitch</h1>} />
            <Route
              path="users/:userId/lots"
              element={<h1>Tyrone Biggums</h1>}
            />
            <Route
              path="users/:userId/bids"
              element={<h1>Cocaine is hell of a drug</h1>}
            />
            <Route path="/account" element={<Account />} />
            <Route path="/*" element={<Navigate replace to="/home" />} />
          </Routes>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
