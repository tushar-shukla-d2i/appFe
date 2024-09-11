import React from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";
import { AppHeader } from "./components";
import { AppRoutes } from "./constants";
import {
  AddEditMetric,
  Attendance,
  AttendanceRecords,
  ChangePassword,
  Dashboard,
  Directory,
  Login,
  ManageUser,
  ManageUsers,
  Metrics,
  Rewards,
  Signup,
  SubMetrics,
  Subordinates,
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
            path={`${AppRoutes.CHANGE_PASSWORD}/:user_id?`}
            element={<ChangePassword />}
          />
          <Route path={AppRoutes.DIRECTORY} element={<Directory />} />
          <Route
            path={`${AppRoutes.ADD_EDIT_METRIC}/:parent_id?/:metric_id?`}
            element={<AddEditMetric />}
          />
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
          <Route path={AppRoutes.ATTENDANCE} element={<Attendance />} />
          <Route
            path={AppRoutes.ATTENDANCE_RECORDS}
            element={<AttendanceRecords />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
