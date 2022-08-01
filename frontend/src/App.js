import { Routes, Route } from "react-router-dom";
import AuthLayout from "./components/auth/auth-layout";
import Layout from "./components/layout";
import Homepage from "./pages/homepage";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />
      </Route>
      <Route path="/auth/" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
