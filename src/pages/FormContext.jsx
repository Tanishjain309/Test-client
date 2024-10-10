import React from 'react';
import {Link} from "react-router-dom";

const FormContext = ({data, handleSubmit, handleChange, span}) => {
    
    return (
        <div className='register-container'>
            <form className="register-form">
                <span className='span' >{span} </span>
                {data.map((item) => (
                    <div className="form-group" key={item.id}>
                        <label htmlFor={item.label}>{item.label}</label>
                        <input
                            type={item.type}
                            id={item.label} 
                            placeholder={item.label}
                            className="form-input"
                            value={item.value}
                            onChange={handleChange}
                        />
                    </div>
                ))}
                <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                {span === "Login Form" && (
                    <div className="link">Not an Existing User ?
                        <Link to={"/register"} >Register</Link>
                    </div>
                )}
                {span === "Register Form" && (
                    <div className="link"> Already an User ?
                        <Link to={"/login"} >Login In</Link>
                    </div>
                )}
            </form>
        </div>
    )
}

export default FormContext
