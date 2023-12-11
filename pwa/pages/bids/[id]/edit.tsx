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

import { Form } from "../../../components/bid/Form";
import { PagedCollection } from "../../../types/collection";
import { Bid } from "../../../types/Bid";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getBid = async (id: string | string[] | undefined) =>
  id ? await fetch<Bid>(`/bids/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: bid } = {} } = useQuery<FetchResponse<Bid> | undefined>(
    ["bid", id],
    () => getBid(id)
  );

  if (!bid) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{bid && `Edit Bid ${bid["@id"]}`}</title>
        </Head>
      </div>
      <Form bid={bid} />
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
  const paths = await getItemPaths(response, "bids", "/bids/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
