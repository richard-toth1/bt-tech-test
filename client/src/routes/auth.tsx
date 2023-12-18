import { Route } from "react-router-dom";
import LoginForm  from '../components/auth/Login'

const routes = [
  <Route path="/login" element={<LoginForm />} key="create" />,
];

export default routes;
