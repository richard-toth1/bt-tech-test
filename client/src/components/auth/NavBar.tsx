import useAuth from '../../hooks/auth'
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const logout = () => {
    setAuth({});
    navigate('/login');
  }

  return (
    <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand mb-0 h1">Auction app</span>
        { auth.username && (
            <>
                <span>Logged in as { auth.username }</span>
                <button onClick={logout}>Logout</button>
            </>
        )}
        </nav>
  )
}

export default NavBar