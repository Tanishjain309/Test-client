import React, { useState, useEffect } from "react";
import FormContext from "../pages/FormContext";
import instance from "../utils/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store";
import Navbar from "./Navbar";

const LoginData = () => {
  const data = [
    { id: 1, label: "email", type: "email" },
    { id: 2, label: "password", type: "password" },
  ];
  const loggedIn = useUserStore((state) => state.loggedIn);
  const setLoggedIn = useUserStore((state) => state.setLoggedIn);
  const setUser = useUserStore((state) => state.setUser);
  const nav = useNavigate();
  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    try {
      const response = await instance.post("/api/auth/login", {
        email,
        password,
      });
      if (response.status === 200) {
        setLoggedIn(true);
        setUser(response.data.data);
        toast.success(response.data.message);
        nav("/");
      }else{
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err);
      if(err.response){
        toast.error(err.response.data.message);
      }else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };
  useEffect(() => {
    if (loggedIn) {
      nav("/");
    }
  }, [loggedIn, nav]);
  return (
    <div>
      <Navbar />
      <FormContext
        data={data}
        span="Login Form"
        handleSubmit={handleSubmit}
        handleChange={handleChange}
      />
    </div>
  );
};

export default LoginData;
