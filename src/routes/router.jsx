import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home/Home";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AllContests from "../pages/AllContests/AllContests";
import PrivateRoute from "../provider/PrivateRoute";
import Dashboard from "../layouts/Dashboard";
import ManageUsers from "../pages/Dashboard/AdminDashboard/ManageUsers";
import ManageContests from "../pages/Dashboard/AdminDashboard/ManageContests";
import AddContest from "../pages/Dashboard/CreatorDashboard/AddContest";
import MyContests from "../pages/Dashboard/CreatorDashboard/MyContests";
import ContestDetails from "../pages/ContestDetails/ContestDetails";
import SubmittedTasks from "../pages/Dashboard/CreatorDashboard/SubmittedTasks";
import MyParticipated from "../pages/Dashboard/UserDashboard/MyParticipated";
import MyWinningContests from "../pages/Dashboard/UserDashboard/MyWinningContests";
import MyProfile from "../pages/Dashboard/UserDashboard/MyProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children: [
      {
        index: true,
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "*",
        element: <ErrorPage></ErrorPage>,
      },
      {
        path: "/all-contests",
        element: <AllContests></AllContests>,
      },
      {
        path: "contest/:id",
        element: (
          <PrivateRoute>
            <ContestDetails></ContestDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/auth",
        element: <AuthLayout></AuthLayout>,
        children: [
          {
            path: "/auth/login",
            element: <Login></Login>,
          },
          {
            path: "/auth/signup",
            element: <Register></Register>,
          },
        ],
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard/manage-users",
        element: <ManageUsers></ManageUsers>,
      },
      {
        path: "/dashboard/manage-contests",
        element: <ManageContests></ManageContests>,
      },
      {
        path: "/dashboard/add-contest",
        element: <AddContest></AddContest>,
      },
      {
        path: "/dashboard/my-contests",
        element: <MyContests></MyContests>,
      },
      {
        path: "/dashboard/submissions",
        element: <SubmittedTasks></SubmittedTasks>,
      },
      {
        path: "/dashboard/participated",
        element: <MyParticipated></MyParticipated>,
      },
      {
        path: "/dashboard/winnings",
        element: <MyWinningContests></MyWinningContests>,
      },
      {
        path: "/dashboard/profile",
        element: <MyProfile></MyProfile>,
      },
    ],
  },
]);
