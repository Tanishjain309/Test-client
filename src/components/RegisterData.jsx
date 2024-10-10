import React, { useState, useEffect } from "react";
import FormContext from "../pages/FormContext";
import instance from "../utils/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store";
import Navbar from "./Navbar";
import "../css/register.css";

const RegisterData = () => {
  const data = [
    { id: 1, label: "name", type: "text" },
    { id: 2, label: "email", type: "email" },
    { id: 3, label: "password", type: "password" },
  ];
  const nav = useNavigate();
  const [formData, setFormData] = useState({});
  const loggedIn = useUserStore((state) => state.loggedIn);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //extrating fields from formData
    console.log("FormData", formData);
    const { name, email, password } = formData;
    //validating Password
    if (!name || name.trim().length < 2) {
      toast.error("Name must be at least 2 characters long");
      return;
    }
    // Validating Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (password.length < 8) {
      toast.error("Password should have at least 8 characters");
      return;
    }
    if (password.includes(" ")) {
      toast.error("Password should not contain spaces");
      return;
    }
    try {
      //making api call...
      const response = await instance.post("/api/auth/register", {
        name,
        email,
        password,
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        nav("/login");
      }
    } catch (err) {
      if (err.response) {
        const errorMessages = err.response.data.error
          .map((error) => error.msg)
          .join(", ");
        toast.error(errorMessages || "Registration failed. Please try again.");
      } else {
        // Network Error or any other error
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
        span="Register Form"
        handleSubmit={handleSubmit}
        handleChange={handleChange}
      />
    </div>
  );
};

export default RegisterData;
