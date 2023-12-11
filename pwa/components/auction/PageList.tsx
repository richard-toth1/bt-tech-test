import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Auction } from "../../types/Auction";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getAuctionsPath = (page?: string | string[] | undefined) =>
  `/auctions${typeof page === "string" ? `?page=${page}` : ""}`;
export const getAuctions = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Auction>>(getAuctionsPath(page));
const getPagePath = (path: string) =>
  `/auctions/page/${parsePage("auctions", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: auctions, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Auction>> | undefined
  >(getAuctionsPath(page), getAuctions(page));
  const collection = useMercure(auctions, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Auction List</title>
        </Head>
      </div>
      <List auctions={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
