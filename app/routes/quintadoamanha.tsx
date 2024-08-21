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
        <div id="esh" className="text-left w-fit text-lg mt-10">
          <h2 className="text-2xl font-semibold mb-4">
            List of things waiting for cake celebration:
          </h2>
          <ul className="space-y-4 list-none">
            <li className="flex items-start">
              <span className="text-2xl mr-2">🏠</span>
              <span>
                Terrace impermeability, ask Marcos dad or in the village
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-2">🚽</span>
              <span>
                Compost toilet in the Aldeia, Ari and Gili in progress
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-2">🚿</span>
              <span>Showers in the Aldeia, concrete poured</span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-2">🪨</span>
              <span>Compost rock moving with Marissa</span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-2">🌿</span>
              <span>
                Brumble battle, prepare your weapons (arms, hands and gloves)
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-2">🎨</span>
              <span>Fence painting, almost done</span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-2">🍵</span>
              <span>
                Kombucha and Ginger beer preparation (always possible, ask
                Peter)
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-2">🥒</span>
              <div>
                <span>Pickle Sunday</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-2">♻️</span>
              <span>
                Paper and Plastic home recycling, starting sorting in the
                storage
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-2">🔧</span>
              <span>Garage work station organization, in the calendar</span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
