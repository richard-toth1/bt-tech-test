import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/auction/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Auction</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
