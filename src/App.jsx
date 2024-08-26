import React from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";
import { AppHeader } from "./components";
import { AppRoutes } from "./constants";
import {
  Dashboard,
  Signup,
  Login,
  Metrics,
  Users,
  Subordinates,
  SubMetrics,
  ManageUser,
  ManageUsers,
  ChangePassword,
  Rewards,
} from "./pages";

const App = () => {
  return (
    <div className="App">
      <AppHeader />
      <main>
        <Routes>
          <Route path={AppRoutes.LOGIN} element={<Login />} />
          <Route path={AppRoutes.SIGNUP} element={<Signup />} />
          <Route path={AppRoutes.DASHBOARD} element={<Dashboard />} />
          <Route path={AppRoutes.USER} element={<ManageUser />} />
          <Route path={`${AppRoutes.USER}/:user_id`} element={<ManageUser />} />
          <Route path={AppRoutes.MANAGE_USERS} element={<ManageUsers />} />
          <Route
            path={`${AppRoutes.CHANGE_PASSWORD}/:user_id`}
            element={<ChangePassword />}
          />
          <Route path={AppRoutes.USERS} element={<Users />} />
          <Route path={AppRoutes.METRICS} element={<Metrics />} />
          <Route
            path={`${AppRoutes.METRICS}/:metric_id`}
            element={<SubMetrics />}
          />
          <Route
            path={`${AppRoutes.SUBORDINATES}/:metric_id`}
            element={<Subordinates />}
          />
          <Route path={AppRoutes.REWARDS} element={<Rewards />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
