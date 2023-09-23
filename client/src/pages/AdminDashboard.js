import '../App.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AdminDashboard = (props) =>
{
  const navigate = useNavigate();


  const logout = () =>
  {
    localStorage.removeItem('my_vinyl_collection_auth_token');
    navigate("/admin/login");
  }

  useEffect(() =>
  {
    const token = localStorage.getItem('my_vinyl_collection_auth_token');
    if (token)
    {
      props.setJwt(token);
    }
    else
    {
      navigate("/admin/login");
    }
  }, [])

  return (
    <div className="AdminDashboard">

      <div className="DashboardHeaderArea">
        <div className="DashboardTitle">
          <h1>Admin Dashboard</h1>
        </div>

        <div className="DashboardLogoutButton" onClick={logout}>
          <p>Log Out</p>
        </div>
      </div>

      <div className="InfoPanel">
        
      </div>

      <div className="AddAndUpdateArea">
        <div className="UpdateArea">

        </div>
        <div className="AddArea">

        </div>
      </div>

      <div className="AdminCredentialsArea">

      </div>
    </div>
  );
}

export default AdminDashboard;