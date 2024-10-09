import React, {useState, useEffect} from 'react'
import "../css/register.css";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from 'react-router-dom'
import instance from "../utils/axios"
import useUserStore from '../store';

const Register = ({data}) => {
    const [formData, setFormData] = useState({});
    const nav = useNavigate();
    const loggedIn = useUserStore((state) => state.loggedIn);

    useEffect(() => {
        if (loggedIn) {
          nav("/");
        }
    }, [loggedIn, nav]);

    const handleChange = (event) => {
        const { id, value } = event.target;
        //Updating formData state using id of input fields
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
        if (!/[A-Z]/.test(password)) {
          toast.error("Password should have at least one uppercase letter");
          return;
        }
        if (!/\d/.test(password)) {
          toast.error("Password should have at least one number");
          return;
        }
        if (password.includes(" ")) {
          toast.error("Password should not contain spaces");
          return;
        }
        try{
            //making api call...
            const response = await instance.post("/api/auth/register", { name, email, password });
            if(response.status === 201){
                toast.success(response.data.message);
                nav("/login");
            }
        }catch(err){
            if (err.response) {
                const errorMessages = err.response.data.error.map(error => error.msg).join(', ');
                toast.error(errorMessages || 'Registration failed. Please try again.');
            } else {
                // Network Error or any other error
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    }
    return (
        <div className='register-container'>
        <form className="register-form">
            {data.map((item) => (
                <div className="form-group" key={item.id}>
                    <label htmlFor={item.label}>{item.label}</label>
                    <input
                        type={item.type}
                        id={item.label} 
                        placeholder={item.label}
                        className="form-input"
                        onChange={handleChange}
                    />
                </div>
            ))}
            <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </form>
        <div className="">Already a User ?
            <Link to={"/login"} className="link" >Login In</Link>
        </div>
        </div>
    )
}

export default Register;
