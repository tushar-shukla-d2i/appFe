import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";
import { Config } from "./utils/config";
import { AppRoutes } from "./constants";
import { AppHeader } from "./components";
import {
  AddEditMetric,
  ApplyLeave,
  Attendance,
  AttendanceRecords,
  ChangePassword,
  Dashboard,
  Directory,
  LeaveRequests,
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
  window.OneSignal = window.OneSignal || [];
  const OneSignal = window.OneSignal;

  useEffect(() => {
    OneSignal.push(() => {
      OneSignal.init(
        {
          appId: Config.ONE_SIGNAL_APP_ID,
          promptOptions: {
            slidedown: {
              enabled: true,
              actionMessage:
                "We'd like to show you notifications for the latest news and updates about the following categories.",
              acceptButtonText: "OMG YEEEEESS!",
              cancelButtonText: "NAHHH",
              categories: {
                tags: [
                  { tag: "react", label: "ReactJS" },
                  { tag: "angular", label: "Angular" },
                  { tag: "vue", label: "VueJS" },
                  { tag: "js", label: "JavaScript" },
                ],
              },
            },
          },
          welcomeNotification: {
            title: "One Signal",
            message: "Thanks for subscribing!",
          },
        },
        //Automatically subscribe to the new_app_version tag
        OneSignal.sendTag("new_app_version", "new_app_version", (tagsSent) => {
          // Callback called when tag has finished sending
          // console.log("new_app_version TAG SENT", tagsSent);
        })
      );
    });
  }, []);

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
          <Route path={AppRoutes.APPLY_LEAVE} element={<ApplyLeave />} />
          <Route path={AppRoutes.LEAVE_REQUESTS} element={<LeaveRequests />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
