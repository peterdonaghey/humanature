import {redirect, type MetaFunction} from "@remix-run/node";
import {Layout} from "../components/Layout";

export const meta: MetaFunction = () => {
  return [
    {title: "Humanature"},
    {name: "description", content: "This is a website"},
  ];
};

export const loader = async () => {
  return redirect("/compost-service-fundao");
};

export default function Index() {
  return (
    <Layout>
      <div className="text-center w-full pt-8">
        <h1 className="text-4xl font-bold">Welcome Home</h1>
      </div>
    </Layout>
  );
}
