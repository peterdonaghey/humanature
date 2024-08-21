import {Layout} from "../components/Layout";

export default function Index() {
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center ">
        <div className="text-center w-full pt-8">
          <h1 className="text-4xl font-bold">Quinta do Amanhã</h1>
          <p className="text-lg">Calendar</p>
        </div>
        <iframe
          src="https://calendar.google.com/calendar/embed?src=c76797a0bd842747eb7dfa50aa9302a7f3d6374b4e887609a5b3c7718988ffde%40group.calendar.google.com&ctz=Europe%2FLondon"
          title="Quinta do Amanhã Calendar"
          className="border-0"
          width="90%"
          height="800"
        ></iframe>
      </div>
    </Layout>
  );
}
