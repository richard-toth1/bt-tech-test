import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Bid } from "../../types/Bid";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getBidsPath = (page?: string | string[] | undefined) =>
  `/bids${typeof page === "string" ? `?page=${page}` : ""}`;
export const getBids = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Bid>>(getBidsPath(page));
const getPagePath = (path: string) => `/bids/page/${parsePage("bids", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: bids, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Bid>> | undefined
  >(getBidsPath(page), getBids(page));
  const collection = useMercure(bids, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Bid List</title>
        </Head>
      </div>
      <List bids={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
