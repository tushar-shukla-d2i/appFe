import React from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";
import { Header } from "./components";
import { AppRoutes } from "./constants";
import {
  Dashboard,
  Signup,
  Login,
  Subordinates,
  Users,
} from "./pages";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path={AppRoutes.LOGIN} element={<Login />} />
          <Route path={AppRoutes.SIGNUP} element={<Signup />} />
          <Route path={AppRoutes.DASHBOARD} element={<Dashboard />} />
          <Route path={AppRoutes.USERS} element={<Users />} />
          <Route path={AppRoutes.SUBORDINATES} element={<Subordinates />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
