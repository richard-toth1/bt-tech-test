import { useNavigate } from "react-router-dom";
import { useCreate } from "../../hooks";
import Form from "./Form";
import { TError } from "../../utils/types";
import TResource from "./type";

interface CreateProps {
  auction: string;
  created: TResource | null;
  create: (item: Partial<TResource>) => any;
  error: TError;
  reset: () => void;
  loading: boolean;
}

const CreateView = ({
  auction,
  create,
  created,
  error,
  reset,
  loading,
}: CreateProps) => {
  const navigate = useNavigate();
  if (created) {
    navigate(0);
  }

  return (
    <div>
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

      <Form initialValues={{auction: auction}} onSubmit={create} error={error} reset={reset} />
    </div>
  );
};

const Create = ({auction}:{auction: string}) => {
  const { created, loading, error, reset, create } = useCreate<TResource>({
    "@id": "bids",
  });

  return (
    <CreateView
      auction={auction}
      created={created}
      loading={loading}
      error={error}
      reset={reset}
      create={create}
    />
  );
};

export default Create;
