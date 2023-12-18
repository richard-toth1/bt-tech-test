import { Route } from "react-router-dom";
import { Show } from "../components/bid/";

const routes = [
  <Route path="/bids/show/:id" element={<Show />} key="show" />,
];

export default routes;
