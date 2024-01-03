import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Main from "./pages/Main";

function App() {
  return (
    <BrowserRouter>
      <CookiesProvider>
        <div className="App">
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="*" element={<Main />} />
          </Routes>
        </div>
      </CookiesProvider>
    </BrowserRouter>
  );
}

export default App;
