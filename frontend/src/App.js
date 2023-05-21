import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAppSetup } from "./hooks/useAppSetup";
import { AppContext } from "./context/AppContext";
import Notice from "./components/Notice";
import NavHeader from "./components/NavHeader";
import Account from "./components/Account";

function App() {
  const appSetup = useAppSetup();

  return (
    <BrowserRouter>
      <AppContext.Provider value={appSetup}>
        <NavHeader />
        <Notice />
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
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
