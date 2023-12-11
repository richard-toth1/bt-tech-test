import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/bid/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Bid</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
