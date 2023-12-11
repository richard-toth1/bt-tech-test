import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Bid } from "../../types/Bid";

interface Props {
  bid?: Bid;
}

interface SaveParams {
  values: Bid;
}

interface DeleteParams {
  id: string;
}

const saveBid = async ({ values }: SaveParams) =>
  await fetch<Bid>(!values["@id"] ? "/bids" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteBid = async (id: string) =>
  await fetch<Bid>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ bid }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Bid> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveBid(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Bid> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteBid(id), {
    onSuccess: () => {
      router.push("/bids");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!bid || !bid["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: bid["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/bids"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {bid ? `Edit Bid ${bid["@id"]}` : `Create Bid`}
      </h1>
      <Formik
        initialValues={
          bid
            ? {
                ...bid,
              }
            : new Bid()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/bids");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: () => {
                setSubmitting(false);
              },
            }
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">
                auction
              </div>
              <FieldArray
                name="auction"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="bid_auction">
                    {values.auction && values.auction.length > 0 ? (
                      values.auction.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`auction.${index}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.insert(index, "")}
                          >
                            +
                          </button>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                      >
                        Add
                      </button>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="bid_price"
              >
                price
              </label>
              <input
                name="price"
                id="bid_price"
                value={values.price ?? ""}
                type="number"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.price && touched.price ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.price && touched.price ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="price"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="bid_owner"
              >
                owner
              </label>
              <input
                name="owner"
                id="bid_owner"
                value={values.owner ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.owner && touched.owner ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.owner && touched.owner ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="owner"
              />
            </div>
            {status && status.msg && (
              <div
                className={`border px-4 py-3 my-4 rounded ${
                  status.isValid
                    ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                    : "text-red-700 border-red-400 bg-red-100"
                }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}
            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {bid && (
          <button
            className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
