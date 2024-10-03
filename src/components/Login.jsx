import { useState } from "react"
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './login.css';


function Login({setusername}) {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')

    const handlelogin = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:3000/login',{username,password});
            setusername(response.data.user.username);
            localStorage.setItem('username', response.data.user.username );
            navigate('/home');
            console.log(response.data)
            console.log(response.data.user.username)
        }
        catch(err){
            console.log(err)

            setError('Invalid username or password');

            const timer = setTimeout(() => {
                setError(''); 
            }, 3000);

            return () => clearTimeout(timer);
            
        }
        
    };
    

    return(
        <div className="container">
            <img src='.\src\assets\unnamed.png'
                    alt="Employee"
                    style={{ width: '200px', height: '100px'}}
                    id="logo"
            />
            <div className="content">
                <form className="loginform" onSubmit={handlelogin}> 
                    User Name
                    <input type="text" className="user" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                    Password
                    <input type="password" className="pass" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <button className="signin" type="submit">Login</button>
                </form>

            </div>
            <div className={`errormessage ${error ? 'show' : ''}`}>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    )
}

export default Login