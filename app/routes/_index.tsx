import type {MetaFunction} from "@remix-run/node";
import {Layout} from "../components/Layout";

export const meta: MetaFunction = () => {
  return [
    {title: "Humanature"},
    {name: "description", content: "This is a website"},
  ];
};

export default function Index() {
  return (
    <Layout>
      <div className=" text-center w-full pt-8">This is the home page</div>
    </Layout>
  );
}
