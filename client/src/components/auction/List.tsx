import { Link, useParams } from "react-router-dom";
import Links from "../Links";
import Pagination from "../Pagination";
import { useRetrieve } from "../../hooks";
import { PagedCollection } from "../../interfaces/Collection";
import TResource from "./type";
import {AuctionStatus, TError} from "../../utils/types";
import useAuth from "../../hooks/auth";
import { AuthContextData } from "../../context/AuthProvider";
import { isSeller } from "../../utils/roleHelper";

interface ListProps {
  retrieved: PagedCollection<TResource> | null;
  loading: boolean;
  error: TError;
  auth: AuthContextData;
}

const ListView = ({ error, loading, retrieved, auth }: ListProps) => {
  const items = (retrieved && retrieved["hydra:member"]) || [];

  return (
    <div>
      <h1>Auction List</h1>

      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error.message}</div>}

      {isSeller(auth) &&
        <p>
          <Link to="create" className="btn btn-primary">
            Create
          </Link>
        </p>
      }

      <table className="table table-responsive table-striped table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Picture</th>
            <th>Starting price</th>
            <th>Current price</th>
            <th>Closing time</th>
            <th>Status</th>
            <th>Owner</th>
            <th colSpan={2} />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const maxBid = item['bids'].reduce((previousValue, currentValue) => {
              return currentValue.price > previousValue.price ? currentValue : previousValue
            }, {price: 0})

            return (
            <tr key={item["@id"]}>
              <td>{item["title"]}</td>
              <td>{item["description"]}</td>
              <td>
              <img width="100px" src={item['picture']['contentUrl']} alt="Auction image"/>
              </td>
              <td>{item["startingPrice"]}</td>
              <td>{maxBid.price > 0 ? maxBid.price : item["startingPrice"]}</td>
              <td>{item["closingTime"]}</td>
              <td>{item["auctionStatus"]}</td>
              <td>{item.owner?.username}</td>
              <td>
                <Link to={`/auctions/show/${encodeURIComponent(item["@id"])}`}>
                  <span className="fa fa-search" aria-hidden="true" />
                  <span className="sr-only">Show</span>
                </Link>
              </td>
              <td>
                { auth.username === item.owner?.username &&
                  item.auctionStatus === AuctionStatus.Pending &&
                  <Link to={`/auctions/edit/${encodeURIComponent(item["@id"])}`}>
                    <span className="fa fa-pencil" aria-hidden="true" />
                    <span className="sr-only">Edit</span>
                  </Link>
                }
              </td>
            </tr>
          )})}
        </tbody>
      </table>

      <Pagination retrieved={retrieved} />
    </div>
  );
};

const List = () => {
  const { page } = useParams<{ page?: string }>();
  const { auth } = useAuth();
  const id = (page && decodeURIComponent(page)) || "auctions";

  const { retrieved, loading, error } =
    useRetrieve<PagedCollection<TResource>>(id);

  return <ListView retrieved={retrieved} loading={loading} error={error} auth={auth} />;
};

export default List;
