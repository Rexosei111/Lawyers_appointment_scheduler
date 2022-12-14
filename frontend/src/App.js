import { Routes, Route } from "react-router-dom";
import AuthLayout from "./components/auth/auth-layout";
import LawyersLayout from "./components/lawyers-listing-layout";
import Layout from "./components/layout";
import Bookings from "./components/profile/bookings";
import Me from "./components/profile/me";
import ProfileLayout from "./components/profileLayout";
import PublicProfile from "./components/publicProfile/profile";
import Homepage from "./pages/homepage";
import Lawyers from "./pages/Lawyers";
import Login from "./pages/login";
import Register from "./pages/register";
import "./App.css";
import Appointments from "./components/Appointments";
import Logout from "./pages/logout";
import Reviews from "./components/profile/Reviews";
import ReviewMore from "./components/profile/ReviewMore";
import File from "./components/profile/File";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="appointments/:id" element={<Appointments />} />
      </Route>
      <Route path="/auth/" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
      </Route>
      <Route path="/lawyers/" element={<LawyersLayout />}>
        <Route index element={<Lawyers />} />
        <Route path="profile/:id" element={<PublicProfile />} />
      </Route>
      <Route path="/lawyers/me" element={<ProfileLayout />}>
        <Route index element={<Me />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="reviews" element={<ReviewMore />} />
        <Route path="files" element={<File />} />
      </Route>
    </Routes>
  );
}

export default App;
