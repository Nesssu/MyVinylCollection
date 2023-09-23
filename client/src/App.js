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

  useEffect(() =>
  {
    const token = localStorage.getItem('my_vinyl_collection_auth_token');
    if (token)
    {
      setJwt(token);
    }
  }, [jwt]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin/dashboard/" element={<AdminDashboard  jwt={jwt} setJwt={setJwt} />} />
          <Route path="/admin/login/" element={<AdminLogin jwt={jwt} setJwt={setJwt} />} />
          <Route path="/" element={<Home />}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
