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
  UserDetail,
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
          <Route
            path={`${AppRoutes.USER_DETAIL}/:user_id`}
            element={<UserDetail />}
          />
          <Route path={AppRoutes.SUBORDINATES} element={<Subordinates />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
