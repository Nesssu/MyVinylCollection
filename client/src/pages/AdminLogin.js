import '../App.css';
import { useState } from "react"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AdminLogin = (props) =>
{
  const [ID, setID] = useState("");
  const [Password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleIDChange = (event) => { setID(event.target.value) }
  const handlePasswordChange = (event) => { setPassword(event.target.value) }
  const login = () =>
  {
    fetch("/api/admin/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(
        {
          id: ID,
          password: Password
        }
      )
    })
    .then(response => response.json())
    .then(json =>
      {
        if (json.success)
        {
            props.setJwt(json.token);
            localStorage.setItem('my_vinyl_collection_auth_token', json.token);
            navigate("/admin/dashboard/");
        }
        else {
            setPassword("");

            toast.error(json.message, {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "dark",
              });
        }
      }
    )
  }
  const handleKeyDown = (event) =>
  {
    if (event.keyCode === 13)
    {
      login();
    }
  }

  return (
    <div className="AdminLogin">
      <div className="DashboardTitle LoginTitle">
        <h1>Admin Dashboard</h1>
      </div>

      <input type="Text" className="LoginInput" placeholder="ID" value={ID} onChange={handleIDChange} />
      <input type="Password" className="LoginInput" placeholder="Password" value={Password} onChange={handlePasswordChange} onKeyDown={handleKeyDown} />
      <input type="Button" className="LoginButton" Value="Login" onClick={login} />

      <ToastContainer/>
    </div>
  );
}

export default AdminLogin;