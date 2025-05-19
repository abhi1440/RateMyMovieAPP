import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => (
  <>
    <ToastContainer />
    <Navigation />
    <main className="pt-20">
      <Outlet />
    </main>
  </>
);

export default App;
