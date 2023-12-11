import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getAuctions,
  getAuctionsPath,
} from "../../../components/auction/PageList";
import { PagedCollection } from "../../../types/collection";
import { Auction } from "../../../types/Auction";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getAuctionsPath(page), getAuctions(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Auction>>("/auctions");
  const paths = await getCollectionPaths(
    response,
    "auctions",
    "/auctions/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
