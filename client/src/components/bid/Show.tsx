import { Link, useParams } from "react-router-dom";
import { useRetrieve } from "../../hooks";
import TResource from "./type";
import { TError } from "../../utils/types";

interface ShowProps {
  retrieved: TResource | null;
  loading: boolean;
  error: TError;
}

const ShowView = ({
  error,
  loading,
  retrieved: item,
}: ShowProps) => {

  return (
    <div>
      <h1>Show Bid {item && item["@id"]}</h1>

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

      {item && (
        <table className="table table-responsive table-striped table-hover">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">auction</th>
              <td>
                <Link to={`/auctions/show/${encodeURIComponent(item["auction"])}`}>{ item["auction"] }</Link>
              </td>
            </tr>
            <tr>
              <th scope="row">price</th>
              <td>{item["price"]}</td>
            </tr>
            <tr>
              <th scope="row">owner</th>
              <td>{item["owner"].username}</td>
            </tr>
          </tbody>
        </table>
      )}      
    </div>
  );
};

const Show = () => {
  const { id } = useParams<{ id: string }>();
  const { retrieved, loading, error } = useRetrieve<TResource>(
    decodeURIComponent(id || "")
  );

  return (
    <ShowView
      retrieved={retrieved}
      loading={loading}
      error={error}
    />
  );
};

export default Show;
