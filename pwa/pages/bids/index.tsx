import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import { PageList, getBids, getBidsPath } from "../../components/bid/PageList";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getBidsPath(), getBids());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export default PageList;
