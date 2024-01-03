import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Navbars = () => {
  const navigate = useNavigate();

  const [cookie, , removeCookie] = useCookies(["authToken"]);
  const handleLogout = () => {
    console.log("logout");
    removeCookie("authToken");
    navigate("/login");
  };
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Employee Management</Navbar.Brand>
          <Nav className="me-auto d-flex justify-content-between align-items-center w-100">
            <div className="d-flex">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/department" className="nav-link">
                Department
              </Link>
            </div>
            <div>
              {!cookie.authToken ? (
                <Link to="/login" className="nav-link">
                  Login / SignUp
                </Link>
              ) : (
                <div
                  onClick={() => {
                    handleLogout();
                  }}
                  className="nav-link"
                >
                  LogOut
                </div>
              )}
            </div>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Navbars;
