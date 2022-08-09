import { Routes, Route } from "react-router-dom";
import AuthLayout from "./components/auth/auth-layout";
import Layout from "./components/layout";
import Bookings from "./components/profile/bookings";
import Me from "./components/profile/me";
import ProfileLayout from "./components/profileLayout";
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
        <Route path="login" element={<Login />} />
      </Route>
      <Route path="/lawyers/me" element={<ProfileLayout />}>
        <Route index element={<Me />} />
        <Route path="bookings" element={<Bookings />} />
      </Route>
    </Routes>
  );
}

export default App;
