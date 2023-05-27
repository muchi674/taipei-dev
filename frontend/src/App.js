import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAppSetup } from "./hooks/useAppSetup";
import { AppContext } from "./context/AppContext";
import NavHeader from "./components/NavHeader";
import Warning from "./components/Warning";
import Explore from "./components/Explore";
import Lots from "./components/lots/Lots";
import Account from "./components/Account";

function App() {
  const appSetup = useAppSetup();

  return (
    <BrowserRouter>
      <AppContext.Provider value={appSetup}>
        <NavHeader />
        <Warning />
        <Routes>
          <Route path="/home" element={<Explore />} />
          <Route path="/lots" element={<Lots />} />
          <Route path="/bids" element={<Navigate replace to="/home" />} />
          <Route path="/account" element={<Account />} />
          <Route path="/*" element={<Navigate replace to="/home" />} />
        </Routes>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
