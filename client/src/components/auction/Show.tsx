import { Link, Navigate, useParams } from "react-router-dom";
import Links from "../Links";
import { useRetrieve, useDelete } from "../../hooks";
import TResource from "./type";
import {AuctionStatus, TError} from "../../utils/types";
import { AuthContextData } from "../../context/AuthProvider";
import useAuth from "../../hooks/auth";
import { Create } from "../../components/bid"
import { isBuyer } from "../../utils/roleHelper";

interface ShowProps {
  retrieved: TResource | null;
  loading: boolean;
  deleteLoading: boolean;
  error: TError;
  deleteError: TError;
  deleted: TResource | null;
  del: (item: TResource) => any;
  auth: AuthContextData;
}

const ShowView = ({
  del,
  deleteError,
  deleted,
  error,
  loading,
  deleteLoading,
  retrieved: item,
  auth,
}: ShowProps) => {
  if (deleted) {
    return <Navigate to="/auctions/" replace />;
  }

  const delWithConfirm = () => {
    if (item && window.confirm("Are you sure you want to delete this item?")) {
      del(item);
    }
  };

  return (
    <div>
      <h1>Show Auction {item && item["@id"]}</h1>

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
      {deleteError && (
        <div className="alert alert-danger" role="alert">
          <span className="fa fa-exclamation-triangle" aria-hidden="true" />{" "}
          {deleteError.message}
        </div>
      )}

      {item && !deleteLoading && (
        <table className="table table-responsive table-striped table-hover">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Title</th>
              <td>{item["title"]}</td>
            </tr>
            <tr>
              <th scope="row">Description</th>
              <td>{item["description"]}</td>
            </tr>
            <tr>
              <th scope="row">Picture</th>
              <td>
                <img className="auction-picture" src={item['picture']['contentUrl']} alt="Auction image"/>
              </td>
            </tr>
            <tr>
              <th scope="row">Starting Price</th>
              <td>{item["startingPrice"]}</td>
            </tr>
            <tr>
              <th scope="row">Closing Time</th>
              <td>{item["closingTime"]}</td>
            </tr>
            <tr>
              <th scope="row">Status</th>
              <td>{item["auctionStatus"]}</td>
            </tr>
            <tr>
              <th scope="row">Owner</th>
              <td>{item.owner?.username}</td>
            </tr>
            <tr>
              <th scope="row">Bids</th>
              <td>
                {
                  item['bids'].length === 0 && <span>No bids yet</span>
                }
                {
                  item["bids"].slice(-5).map((bid) => (
                    <li>{bid.price}{auth.username === item.owner?.username && (<> - <Links
                      items={{
                        href: `/bids/show/${encodeURIComponent(bid['@id'])}`,
                        name: bid['@id'],
                      }}
                    /></>)}</li>
                  ))
                }
                { isBuyer(auth) && <Create auction={item["@id"]}/> }
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <Link to="/auctions/" className="btn btn-primary">
        Back to list
      </Link>
      {item && auth.username === item.owner?.username &&
        item.auctionStatus === AuctionStatus.Pending && (
        <Link to={`/auctions/edit/${encodeURIComponent(item["@id"])}`}>
          <button className="btn btn-warning">Edit</button>
        </Link>
      )}
      {item && auth.username === item.owner?.username &&
        item.auctionStatus === AuctionStatus.Pending && (
      <button onClick={delWithConfirm} className="btn btn-danger">
        Delete
      </button>
      )}
    </div>
  );
};

const Show = () => {
  const { id } = useParams<{ id: string }>();
  const { retrieved, loading, error } = useRetrieve<TResource>(
    decodeURIComponent(id || "")
  );
  const { loading: deleteLoading, deleted, error: deleteError, del } = useDelete<TResource>();
  const { auth } = useAuth();

  return (
    <ShowView
      retrieved={retrieved}
      loading={loading}
      deleteLoading={deleteLoading}
      error={error}
      deleteError={deleteError}
      deleted={deleted}
      del={del}
      auth={auth}
    />
  );
};

export default Show;
