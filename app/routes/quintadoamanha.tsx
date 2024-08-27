import {Layout} from "../components/Layout";

export default function Index() {
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center">
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
        <div className="flex flex-col md:flex-row justify-center items-start space-x-8 w-full mt-10 ">
          <div id="esh" className="text-left w-full md:w-1/2 text-lg mx-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              List of things waiting for cake celebration 🍰 :
            </h2>
            <ul className="space-y-4 list-none">
              <li className="flex items-start">
                <span className="text-2xl mr-2">🏠</span>
                <span>Terrace impermeability, before RAIN on Saturday</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-2">🚿</span>
                <span>Shower in the Aldeia, concrete poured twice!</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-2">🪨</span>
                <span>Compost rock moving with Marissa, ongoing</span>
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
                  <span>Pickle day</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-2">♻️</span>
                <span>
                  CLEAN Paper and Plastic home recycling, starting sorting in
                  the storage (its for walls insolation!!)
                </span>
              </li>
            </ul>
          </div>
          <div
            id="finished-projects"
            className="text-left w-full md:w-1/2 text-lg"
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">
              FINISHED PROJECTS 🎉 Thanks to all family!! ❤️
            </h2>
            <ul className="space-y-4 list-none">
              <li className="flex items-start">
                <span className="text-2xl mr-2">🚀</span>
                <span>FUTURA space organization + party initiation</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-2">🚽</span>
                <span>
                  Compost toilet in the ALDEIA (special thanks Ari and Gili)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-2">🧹</span>
                <span>Deep end of summer cleaning</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-2">🌿</span>
                <span>Bramble battle, big success, one of many... </span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-2">🎨</span>
                <span>
                  Fence painting (special thanks Galia and Talia for focalizing)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-2">🛠️</span>
                <span>Garage DOWN BELOW cleaning and organization</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-start space-x-8 w-full mt-10 mx-10">
          <div
            id="ongoing-projects"
            className="text-left w-full md:w-1/2 text-lg mx-8"
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">
              ONGOING PROJECTS 🔄
            </h2>
            <ul className="space-y-4 list-none">
              <li className="flex items-start">
                <span className="text-2xl mr-2">🤝</span>
                <span>
                  Community building (meetings, movie nights, jams sessions,
                  Shuk dates, river swims)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-2">☕</span>
                <span>
                  Space holding and organic Chai shop in festivals for
                  fundraising
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-2">🧪</span>
                <span>
                  Fermenteria (Kombucha, Ginger beer, Tempeh, pickles)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-2">🏡</span>
                <span>
                  Composting and compost recollection for soil regeneration
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-2">♻️</span>
                <span>Dumpster diving and revaluation of Trash</span>
              </li>
            </ul>
          </div>
          <div
            id="fall-winter-projects"
            className="text-left w-full md:w-1/2 text-lg"
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">
              FALL/WINTER PROJECTS 🍂❄️
            </h2>
            <ul className="space-y-4 list-none">
              <li className="flex items-start">
                <span className="text-2xl mr-2">🏠</span>
                <span>FUTURA home made recycled insolation</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-2">🌱</span>
                <span>TERRACE greenhouse</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-2">🍄</span>
                <span>Fungi propagation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
