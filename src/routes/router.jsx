import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home/Home";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AllContests from "../pages/AllContests/AllContests";

export const router = createBrowserRouter([
  {
    path: "/",
    element:<RootLayout></RootLayout>,
    children: [
      {
        index: true,
        path: "/",
        element:<Home></Home>,
      },
      {
        path: "*",
        element: <ErrorPage></ErrorPage>,
      },
      {
        path:'/all-contests',
        element: <AllContests></AllContests>,
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
]);
