import type {MetaFunction} from "@remix-run/node";
import {useState} from "react";

export const meta: MetaFunction = () => {
  return [
    {title: "Humanature"},
    {name: "description", content: "This is a website"},
  ];
};

export default function Index() {
  const [buttonText, setButtonText] = useState(
    "Click here and maybe something will happen"
  );

  const handleClick = () => {
    setButtonText("loading...");
    setTimeout(() => {
      setButtonText("nothing is happening sorry");
    }, 3000);
    setTimeout(() => {
      setButtonText("Click here and maybe something will happen");
    }, 7000);
  };
  return (
    <main className="font-sans p-16 flex flex-col items-center justify-center bg-teal-300 h-screen">
      <div className="flex flex-col items-center justify-center  bg-indigo-300 w-full h-full p-16">
        <div className="flex flex-col items-center justify-center  bg-yellow-300 w-full h-full p-16">
          <div className="flex flex-col items-center justify-center  bg-red-300 w-full h-full p-16">
            <div className="flex flex-col items-center justify-center  bg-lime-300 w-full h-full p-16">
              <h1 className="text-3xl pb-2">Welcome</h1>
              <p>This is a website</p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10"
                onClick={handleClick}
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
