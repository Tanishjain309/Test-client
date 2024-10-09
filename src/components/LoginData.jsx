import React from 'react'
import Login from '../pages/Login'

const LoginData = () => {
    const data = [ 
        { id: 1, label: "email", type: "email" },
        { id: 2, label: "password", type: "password" }
    ]
  return (
    <div>
        <Login data={data} />
    </div>
  )
}

export default LoginData
