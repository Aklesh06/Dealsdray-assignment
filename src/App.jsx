import Login from './components/Login'
import Home from './components/Home'
import Emplist from './components/Emplist'
import Empcreate from './components/Empcreate'
import Navbar from './components/Navbar'
import Session from './Session'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useState , useEffect} from 'react';

function App() {

  const [username, setusername] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setusername(storedUsername);
        }
    }, []);

  return(
      <Router>
        <Routes>
          <Route path='/' element={<Login setusername = {setusername}/>} />
          <Route path='/home' element={<Session><><Navbar username={username} setusername = {setusername} /><Home /></></Session>} />
          <Route path='/emplist' element={<Session><><Navbar username={username} setusername = {setusername} /><Emplist /></></Session>} />
          <Route path='/emplist/create' element={<Session><><Navbar username={username} setusername = {setusername} /><Empcreate /></></Session>} />
          <Route path='/emplist/edit/:employeeId' element={<Session><><Navbar username={username} setusername = {setusername} /><Empcreate /></></Session>} />
        </Routes>
        
      </Router>
    )
     
}

export default App
