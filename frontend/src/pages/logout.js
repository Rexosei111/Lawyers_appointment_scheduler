import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/storage";

export default function Logout() {
  const [token, setToken] = useLocalStorage("token", null);
  const navigate = useNavigate();

  useEffect(() => {
    setToken(null);
    navigate("/");
  });
  return <div>You have logged out</div>;
}
