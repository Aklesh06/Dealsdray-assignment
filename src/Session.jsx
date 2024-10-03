import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Session({ children }) {
  const navigate = useNavigate();
  const username = localStorage.getItem('username'); 

  useEffect(() => {
    if (!username) {
      navigate('/');
    }
  }, [navigate, username]);

  return children;
}

export default Session;
