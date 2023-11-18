import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useEffect, useState } from "react"; 
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';

const App = () =>
{
  const [jwt, setJwt] = useState("");
  const [correctToken, setCorrectToken] = useState(false);

  useEffect(() =>
  {
    const token = localStorage.getItem('my_vinyl_collection_auth_token');
    if (token)
    {
      // Authenticate token
      const body = {
        token
      };

      fetch('/api/admin/validate_token/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      })
      .then(response => response.json())
      .then(json => 
        {
          if (json.success)
          {
            setCorrectToken(true);
            setJwt(token);
          }
        }
      );
    }
  }, [jwt]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin/dashboard/" element={correctToken ? ( <AdminDashboard  jwt={jwt} setJwt={setJwt} /> ) : ( <AdminLogin jwt={jwt} setJwt={setJwt} /> )} />
          <Route path="/admin/login/" element={<AdminLogin jwt={jwt} setJwt={setJwt} />} />
          <Route path="/" element={<Home />}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
