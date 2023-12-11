import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getBids,
  getBidsPath,
} from "../../../components/bid/PageList";
import { PagedCollection } from "../../../types/collection";
import { Bid } from "../../../types/Bid";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getBidsPath(page), getBids(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Bid>>("/bids");
  const paths = await getCollectionPaths(response, "bids", "/bids/page/[page]");

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
