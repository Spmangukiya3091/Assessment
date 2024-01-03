import React, { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./login.css";
import { useCookies } from "react-cookie";
import BackgroundImage from "../assets/images/background.png";
import Logo from "../assets/images/logo.png";
import { useLoginMutation } from "../service/service";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [cookies, setCookie] = useCookies();
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [login, response] = useLoginMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Call the login mutation with the username and password
      await login({ username: inputUsername, password: inputPassword });
    } catch (error) {
      console.error("Error during login:", error);
      setShowError(true);
    }

    setLoading(false);
  };
  useEffect(() => {
    // Check if the login was successful
    if (response.data && response.data.token) {
      setCookie("authToken", response.data.token, { path: "/" });
      navigate("/");
      console.log("Login successful. Token:", response.data.token);
    } else if (response.isError) {
      setShowError(true);
    }
  }, [navigate, response, setCookie]);

  const handlePassword = () => {
    navigate("/signup");
  };

  return (
    <div className="sign-in__wrapper" style={{ backgroundImage: `url(${BackgroundImage})` }}>
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        {/* Header */}
        <img className="img-thumbnail mx-auto d-block mb-2" src={Logo} alt="logo" />
        <div className="h4 mb-2 text-center">Sign In</div>
        {/* Alert */}
        {showError && (
          <Alert className="mb-2" variant="danger" onClose={() => setShowError(false)} dismissible>
            Incorrect username or password.
          </Alert>
        )}
        <Form.Group className="mb-2 text-start" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" value={inputUsername} placeholder="Username" onChange={(e) => setInputUsername(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-2 text-start" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={inputPassword} placeholder="Password" onChange={(e) => setInputPassword(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-2 text-start" controlId="checkbox">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group>
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Log In
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Logging In...
          </Button>
        )}
        <div className="d-grid justify-content-end">
          <Button className="text-muted px-0" variant="link" onClick={handlePassword}>
            SignUp
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
