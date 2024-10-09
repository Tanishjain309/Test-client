import React from 'react'
import Register from '../pages/Register';

const Data = () => {
    const data = [
        { id: 1, label: "name", type: "text" },
        { id: 2, label: "email", type: "email" },
        { id: 3, label: "password", type: "password" }
    ];
    return (
        <div>
            <Register data={data} />
        </div>
    )
}

export default Data;
