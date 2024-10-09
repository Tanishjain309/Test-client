import React, {useState, useEffect} from 'react';
import instance from '../utils/axios';
import {toast} from "react-hot-toast";
import {Link, useNavigate } from 'react-router-dom';
import useUserStore from '../store';

const Login = ({data}) => {
    const [formData, setFormData] = useState({});
    const loggedIn = useUserStore((state) => state.loggedIn);
    const setLoggedIn = useUserStore((state) => state.setLoggedIn);
    const setUser = useUserStore((state) => state.setUser);
    const nav = useNavigate();
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value, 
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const {email, password} = formData;
        try {
            const response = await instance.post("/api/auth/login", {email,password});
            if(response.status === 200){
                setLoggedIn(true);
                setUser(response.data.data);
                toast.success(response.data.message);
                nav("/");
            }
        } catch (err) {
            if (err.response) {
                const errorMessages = err.response.data.error.map(error => error.msg).join(', ');
                toast.error(errorMessages || 'Registration failed. Please try again.');
            } else {
                // Network Error or any other error
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    }
    useEffect(() => {
        if(loggedIn) {
          nav('/');
        };
    }, [loggedIn, nav])
    
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
            <div className="">Not an Existing User ?
                <Link to={"/register"} className="link" >Register</Link>
            </div>
        </div>
    )
}

export default Login
