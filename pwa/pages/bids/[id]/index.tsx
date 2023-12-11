import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Show } from "../../../components/bid/Show";
import { PagedCollection } from "../../../types/collection";
import { Bid } from "../../../types/Bid";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getBid = async (id: string | string[] | undefined) =>
  id ? await fetch<Bid>(`/bids/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: bid, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Bid> | undefined>(["bid", id], () => getBid(id));
  const bidData = useMercure(bid, hubURL);

  if (!bidData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Bid ${bidData["@id"]}`}</title>
        </Head>
      </div>
      <Show bid={bidData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["bid", id], () => getBid(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Bid>>("/bids");
  const paths = await getItemPaths(response, "bids", "/bids/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
