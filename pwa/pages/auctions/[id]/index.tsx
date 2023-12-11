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

import { Show } from "../../../components/auction/Show";
import { PagedCollection } from "../../../types/collection";
import { Auction } from "../../../types/Auction";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getAuction = async (id: string | string[] | undefined) =>
  id ? await fetch<Auction>(`/auctions/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: auction, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Auction> | undefined>(["auction", id], () =>
      getAuction(id)
    );
  const auctionData = useMercure(auction, hubURL);

  if (!auctionData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Auction ${auctionData["@id"]}`}</title>
        </Head>
      </div>
      <Show auction={auctionData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["auction", id], () => getAuction(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Auction>>("/auctions");
  const paths = await getItemPaths(response, "auctions", "/auctions/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
