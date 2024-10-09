// import React from 'react';

// const Login = ({ isUpdate, data }) => {
//   return (
//     <div className="login-container">
//       <form className="login-form">
//         {data.map((a,b) =>(
//             <div className="form-group" key={b}>
//             <label htmlFor="name">{a.label}</label>
//             <input
//                 type={a.label}
//                 id={a.label}
//                 placeholder={a.label}
//                 disabled={!isUpdate}
//                 className="form-input"
//             />
//             </div>
//         ))}
//         <button className="submit-btn">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default Login;

// export const CreateLogin = () => <Login isUpdate={false} />;
// export const UpdateLogin = () => <Login isUpdate={true} />;