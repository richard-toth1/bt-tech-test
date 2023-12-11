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

import { Form } from "../../../components/auction/Form";
import { PagedCollection } from "../../../types/collection";
import { Auction } from "../../../types/Auction";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getAuction = async (id: string | string[] | undefined) =>
  id ? await fetch<Auction>(`/auctions/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: auction } = {} } = useQuery<
    FetchResponse<Auction> | undefined
  >(["auction", id], () => getAuction(id));

  if (!auction) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{auction && `Edit Auction ${auction["@id"]}`}</title>
        </Head>
      </div>
      <Form auction={auction} />
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
  const paths = await getItemPaths(response, "auctions", "/auctions/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
