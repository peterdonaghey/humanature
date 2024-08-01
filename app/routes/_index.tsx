import type {MetaFunction} from "@remix-run/node";
import {Link} from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    {title: "Humanature"},
    {name: "description", content: "This is a website"},
  ];
};

export default function Index() {
  return (
    <main className="font-sans flex flex-col items-center h-screen">
      <img
        src="https://humanature.s3.eu-central-1.amazonaws.com/humanature_banner.png"
        alt="Humanature"
        className=" w-3/4 "
      />
      <Link to="/compost" className="relative group cursor-pointer mt-4">
        <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 to-red-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
        <div className="relative px-7 py-4 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
          <div className="space-y-1">
            <p className="text-slate-800">compost</p>
          </div>
        </div>
      </Link>
      <div className=" text-center w-full pt-8">This is the home page</div>
    </main>
  );
}
