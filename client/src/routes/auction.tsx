import { Route } from "react-router-dom";
import { List, Create, Update, Show } from "../components/auction/";

const routes = [
  <Route path="/auctions/create" element={<Create />} key="create" />,
  <Route path="/auctions/edit/:id" element={<Update />} key="update" />,
  <Route path="/auctions/show/:id" element={<Show />} key="show" />,
  <Route path="/auctions" element={<List />} key="list" />,
  <Route path="/auctions/:page" element={<List />} key="page" />,
];

export default routes;
