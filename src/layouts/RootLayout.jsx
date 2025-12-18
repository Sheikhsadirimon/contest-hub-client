import React from "react";
import { Outlet, useNavigation } from "react-router";
import Footer from "../pages/shared/Footer/Footer";
import Navbar from "../pages/shared/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import Loading from "../components/Loading/Loading";

const RootLayout = () => {
  const { state } = useNavigation();
  return (
    <div>
      <Navbar></Navbar>
      {state == "loading" ? <Loading></Loading> : <Outlet></Outlet>}
      <Footer></Footer>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default RootLayout;
