import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import NavHeader from "./components/NavHeader";
import SignIn from "./components/SignIn";

function App() {
  return (
    <BrowserRouter>
      <NavHeader />
      <main>
        <Routes>
          <Route path="/home" element={<h1>I'm Rick James, bitch</h1>} />
          <Route path="users/:userId/lots" element={<h1>Tyrone Biggums</h1>} />
          <Route
            path="users/:userId/bids"
            element={<h1>Cocaine is hell of a drug</h1>}
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/*" element={<Navigate replace to="/home" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
