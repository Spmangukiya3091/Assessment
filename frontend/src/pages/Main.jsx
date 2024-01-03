import React from "react";
import Navbars from "../Components/Navbars";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Department from "./Department";

const Main = () => {
  return (
    <>
      <Navbars />
      <div className="main-section container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route exact path="/department" element={<Department />} />
        </Routes>
      </div>
    </>
  );
};

export default Main;
