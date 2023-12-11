import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Auction } from "../../types/Auction";

interface Props {
  auction?: Auction;
}

interface SaveParams {
  values: Auction;
}

interface DeleteParams {
  id: string;
}

const saveAuction = async ({ values }: SaveParams) =>
  await fetch<Auction>(!values["@id"] ? "/auctions" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteAuction = async (id: string) =>
  await fetch<Auction>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ auction }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Auction> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveAuction(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Auction> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteAuction(id), {
    onSuccess: () => {
      router.push("/auctions");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!auction || !auction["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: auction["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/auctions"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {auction ? `Edit Auction ${auction["@id"]}` : `Create Auction`}
      </h1>
      <Formik
        initialValues={
          auction
            ? {
                ...auction,
              }
            : new Auction()
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
                router.push("/auctions");
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
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="auction_title"
              >
                title
              </label>
              <input
                name="title"
                id="auction_title"
                value={values.title ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.title && touched.title ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.title && touched.title ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="title"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="auction_description"
              >
                description
              </label>
              <input
                name="description"
                id="auction_description"
                value={values.description ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.description && touched.description
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.description && touched.description ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="description"
              />
            </div>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">
                picture
              </div>
              <FieldArray
                name="picture"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="auction_picture">
                    {values.picture && values.picture.length > 0 ? (
                      values.picture.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`picture.${index}`} />
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
                htmlFor="auction_startingPrice"
              >
                startingPrice
              </label>
              <input
                name="startingPrice"
                id="auction_startingPrice"
                value={values.startingPrice ?? ""}
                type="number"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.startingPrice && touched.startingPrice
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.startingPrice && touched.startingPrice
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="startingPrice"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="auction_closingTime"
              >
                closingTime
              </label>
              <input
                name="closingTime"
                id="auction_closingTime"
                value={values.closingTime?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.closingTime && touched.closingTime
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.closingTime && touched.closingTime ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="closingTime"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="auction_auctionStatus"
              >
                auctionStatus
              </label>
              <input
                name="auctionStatus"
                id="auction_auctionStatus"
                value={values.auctionStatus ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.auctionStatus && touched.auctionStatus
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.auctionStatus && touched.auctionStatus
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="auctionStatus"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="auction_owner"
              >
                owner
              </label>
              <input
                name="owner"
                id="auction_owner"
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
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">bids</div>
              <FieldArray
                name="bids"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="auction_bids">
                    {values.bids && values.bids.length > 0 ? (
                      values.bids.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`bids.${index}`} />
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
        {auction && (
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
