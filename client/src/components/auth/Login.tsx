import { useFetch } from "../../hooks";
import { useNavigate } from "react-router-dom";
import Form from "./Form";
import { TError } from "../../utils/types";
import { useState } from "react";
import { Login } from "../../interfaces/Auth";
import useAuth from "../../hooks/auth";
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    username: string,
    roles: string[]
}
interface LoginProps {
  login: (item: Partial<Login>) => any,
  error: TError;
  loading: boolean;
  reset: () => void
}

const LoginView = ({
  login,
  error,
  loading,
  reset
}: LoginProps) => {
  return (
    <div>
      <h1>Login</h1>

      {loading && (
        <div className="alert alert-info" role="status">
          Loading...
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          <span className="fa fa-exclamation-triangle" aria-hidden="true" />{" "}
          {error.message}
        </div>
      )}

      <Form onSubmit={login} error={error} reset={reset} />
    </div>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  const { fetch } = useFetch();
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TError>(null);
  
  const handleLogin = (loginData: Partial<Login>) => {
    setLoading(true);

    return fetch("/auth", {
        method: "POST",
        body: JSON.stringify(loginData),
      })
        .then(({ json }) => json)
        .then((retrieved) => {
            const decoded = jwtDecode<JwtPayload>(retrieved?.token);            
            setAuth({...decoded, token: "Bearer " + retrieved?.token})
        })
        .then(() => navigate("/auctions"))
        .catch((e) => {
            setError(e);
        })
        .finally(() => setLoading(false));
  }

  const reset = () => {
    setLoading(false);
    setError(null);
  }

  return (
    <LoginView
        login={handleLogin}
        loading={loading}
        error={error}
        reset={reset}
    />
  );
};

export default LoginForm;
