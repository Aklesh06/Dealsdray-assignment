import { Link } from 'react-router-dom'; 
import './navbar.css';
import { useNavigate } from 'react-router-dom';
 
function Navbar({ username , setusername }){

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('username');
        setusername('');
        navigate('/');
    };

    return (
        <nav className='navbar'>
            <ul className='navlist'>
                <img src='.\src\assets\unnamed.png'
                    alt="Employee"
                    style={{ width: '200px', height: '100px' }}
                />
                <li className='navitem'>
                    <Link to='/home'  style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
                </li>
                <li className='navitem'>
                    <Link to='/emplist'  style={{ color: 'inherit', textDecoration: 'none' }}>EmployeeList</Link>
                </li>

                {username && <div className="username">{username}-</div>}

                <div className='logout'>
                        <button onClick={handleLogout}>Logout</button>
                </div>
            </ul>
        </nav>
    )
}

export default Navbar; 