import {Layout} from "../components/Layout";
import {useEffect, useState} from "react";
import {useLanguage} from "../contexts/LanguageContext";
import {CalendarEmbed} from "../components/CalendarEmbed";

export default function Index() {
  const {language} = useLanguage();
  const [, setMousePosition] = useState({x: 0, y: 0});
  const [rotation, setRotation] = useState(0);
  const [prevAngle, setPrevAngle] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({x: e.clientX, y: e.clientY});

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

      if (prevAngle !== null) {
        // Calculate the difference between current and previous angles
        let angleDiff = currentAngle - prevAngle;

        // Handle wrap-around: if the difference is > π, we crossed the boundary
        if (angleDiff > Math.PI) {
          angleDiff -= 2 * Math.PI;
        } else if (angleDiff < -Math.PI) {
          angleDiff += 2 * Math.PI;
        }

        // Accumulate the rotation with some damping for smooth movement
        setRotation((prev) => prev + angleDiff * (180 / Math.PI) * 0.3);
      }

      setPrevAngle(currentAngle);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prevAngle]);

  // CARD SPACING - Adjust this value to change how far apart the cards are
  const CARD_RADIUS = 260; // Distance from center to cards (in pixels)

  const cardsData = {
    ptText: [
      {
        id: "coming-up",
        icon: "🦄",
        title: "aproximando-se..",
        color: "from-pink-100 to-rose-200",
        textColor: "text-pink-800",
        items: [
          {icon: "🗻", text: "montanhas dignas - dom 21, 11h"},
          {icon: "🤸‍♀️", text: "acroyoga - 30 de setembro"},
          {icon: "🌈", text: "jornada arco-íris do peter (1 out)"},
          {icon: "🐔", text: "começar portão das galinhas"},
          {icon: "🌰", text: "workshop de sementes com raymundo"},
        ],
      },
      {
        id: "good-stuff",
        icon: "🎊",
        title: "vitórias recentes",
        color: "from-green-100 to-emerald-200",
        textColor: "text-green-800",
        items: [
          {icon: "💻", text: "novo projeto web lançado"},
          {icon: "🌿", text: "jardim de ervas indoor criado"},
          {icon: "🔥", text: "doc de incêndio quase pronto"},
          {icon: "🧰", text: "espaços de workshop organizados"},
          {icon: "🔧", text: "cerca das galinhas instalada"},
        ],
      },
      {
        id: "always-happening",
        icon: "🌀",
        title: "sempre acontecendo",
        color: "from-blue-100 to-sky-200",
        textColor: "text-blue-800",
        items: [
          {icon: "🧪", text: "experiências da fermentaria"},
          {icon: "🌳", text: "propagação de árvores"},
          {icon: "🗺️", text: "planeamento da terra"},
          {icon: "🎭", text: "workshops & vibes da aldeia"},
          {icon: "🏗️", text: "progresso da cimentação"},
        ],
      },
      {
        id: "autumn-vibes",
        icon: "🍄",
        title: "intenções outono",
        color: "from-purple-100 to-violet-200",
        textColor: "text-purple-800",
        items: [
          {icon: "💭", text: "conversas núcleo quinta"},
          {icon: "📜", text: "desenvolvimento da associação"},
          {icon: "🎨", text: "embelezamento do pátio"},
          {icon: "🔥", text: "preparar para o inverno"},
          {icon: "🏠", text: "finalizar terraço da futura"},
        ],
      },
      {
        id: "mystery-box",
        icon: "🎲",
        title: "acontecimentos misteriosos",
        color: "from-yellow-100 to-amber-200",
        textColor: "text-amber-800",
        items: [
          {icon: "🦋", text: "sessões de jam espontâneas"},
          {icon: "🔮", text: "círculos de visão futura"},
          {icon: "🎪", text: "eventos comunitários surpresa"},
          {icon: "✨", text: "magia que simplesmente acontece"},
          {icon: "🎵", text: "música inesperada"},
        ],
      },
    ],
    enText: [
      {
        id: "coming-up",
        icon: "🦄",
        title: "coming up..",
        color: "from-pink-100 to-rose-200",
        textColor: "text-pink-800",
        items: [
          {icon: "🗻", text: "dignified mountains - sun 21st, 11am"},
          {icon: "🤸‍♀️", text: "acroyoga - sept 30th"},
          {icon: "🌈", text: "peter's rainbow journey (oct 1st)"},
          {icon: "🐔", text: "start chicken gate project"},
          {icon: "🌰", text: "seed workshop with raymundo"},
        ],
      },
      {
        id: "good-stuff",
        icon: "🎊",
        title: "recent wins",
        color: "from-green-100 to-emerald-200",
        textColor: "text-green-800",
        items: [
          {icon: "💻", text: "new web project landed"},
          {icon: "🌿", text: "indoor herb garden created"},
          {icon: "🔥", text: "wildfire doc almost done"},
          {icon: "🧰", text: "workshop spaces organized"},
          {icon: "🔧", text: "chicken fence installed"},
        ],
      },
      {
        id: "always-happening",
        icon: "🌀",
        title: "always happening",
        color: "from-blue-100 to-sky-200",
        textColor: "text-blue-800",
        items: [
          {icon: "🧪", text: "fermentaria experiments"},
          {icon: "🌳", text: "tree propagation & prep"},
          {icon: "🗺️", text: "land planning & development"},
          {icon: "🎭", text: "workshops & village vibes"},
          {icon: "🏗️", text: "terrace cementing progress"},
        ],
      },
      {
        id: "autumn-vibes",
        icon: "🍄",
        title: "autumn intentions",
        color: "from-purple-100 to-violet-200",
        textColor: "text-purple-800",
        items: [
          {icon: "💭", text: "quinta core talks"},
          {icon: "📜", text: "association development"},
          {icon: "🎨", text: "courtyard beautification"},
          {icon: "🔥", text: "prepare for winter"},
          {icon: "🏠", text: "finish futura terrace"},
        ],
      },
      {
        id: "mystery-box",
        icon: "🎲",
        title: "mystery happenings",
        color: "from-yellow-100 to-amber-200",
        textColor: "text-amber-800",
        items: [
          {icon: "🦋", text: "spontaneous jam sessions"},
          {icon: "🔮", text: "future vision circles"},
          {icon: "🎪", text: "surprise community events"},
          {icon: "✨", text: "magic that just happens"},
          {icon: "🎵", text: "unexpected music"},
        ],
      },
    ],
  };

  const cards = language === "pt" ? cardsData.ptText : cardsData.enText;

  const mainTitle = {
    ptText: {
      desktop: "A RODA DOS ACONTECIMENTOS",
      mobile: "ACONTECIMENTOS",
    },
    enText: {
      desktop: "THE WHEEL OF HAPPENINGS",
      mobile: "HAPPENINGS",
    },
  };

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center mb-16">
        <CalendarEmbed />

        <div className={`text-center`}>
          {/* Desktop Title */}
          <h2
            className={`mb-4 hidden md:block
               text-6xl font-bold text-transparent font-mono tracking-wider
               bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text 
               animate-pulse`}
          >
            {language === "pt"
              ? mainTitle.ptText.desktop
              : mainTitle.enText.desktop}
          </h2>

          {/* Mobile Title */}
          <h2
            className={`mb-4 block md:hidden
               text-4xl font-bold text-transparent font-mono tracking-wider
               bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text 
               animate-pulse`}
          >
            {language === "pt"
              ? mainTitle.ptText.mobile
              : mainTitle.enText.mobile}
          </h2>
          <div className="flex justify-center items-center space-x-2 text-2xl">
            <span className="animate-spin">🌀</span>
            {/* <span className="text-lg text-gray-500 font-mono">
              ~ spin the quinta universe ~
            </span> */}
            <span
              className="animate-spin"
              style={{animationDirection: "reverse"}}
            >
              ✨
            </span>
          </div>
        </div>

        {/* Desktop: Spinning Circle of Cards */}
        <div className="hidden md:block">
          <div
            className={`relative w-full max-w-5xl mx-auto px-4 mt-[220px] mb-[150px]`}
          >
            <div
              className="relative w-[600px] h-[600px] mx-auto transition-transform duration-1000 ease-out"
              style={{transform: `rotate(${rotation}deg)`}}
            >
              {cards.map((card, index) => {
                const angle = index * 72 - 90; // 360/5 = 72 degrees between each card, -90 to start at top
                const x = Math.cos((angle * Math.PI) / 180) * CARD_RADIUS;
                const y = Math.sin((angle * Math.PI) / 180) * CARD_RADIUS;

                return (
                  <div
                    key={card.id}
                    className={`absolute w-64 min-h-64 max-w-80 bg-gradient-to-br ${card.color} rounded-3xl p-4 shadow-lg border border-white/50 transform hover:scale-110 hover:z-20 transition-all duration-300`}
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: `translate(-50%, -50%) rotate(${-rotation}deg)`, // Center the card and counter-rotate
                    }}
                  >
                    <div className="text-center mb-3">
                      <div className="text-4xl mb-2">{card.icon}</div>
                      <h3
                        className={`text-base font-bold ${card.textColor} font-mono lowercase`}
                      >
                        {card.title}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {card.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-start text-sm bg-white/50 rounded-lg p-3"
                        >
                          <span className="text-base mr-3 flex-shrink-0">
                            {item.icon}
                          </span>
                          <span className={`${card.textColor} leading-relaxed`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: Paneled Grid Layout */}
        <div className="block md:hidden">
          <div className="w-full max-w-md mx-auto px-4 mt-8 mb-16">
            <div className="space-y-6">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`w-full bg-gradient-to-br ${card.color} rounded-2xl p-4 shadow-lg border border-white/50 transition-all duration-300 hover:scale-105`}
                >
                  <div className="text-center mb-3">
                    <div className="text-3xl mb-2">{card.icon}</div>
                    <h3
                      className={`text-sm font-bold ${card.textColor} font-mono lowercase`}
                    >
                      {card.title}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {card.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-start text-xs bg-white/50 rounded-lg p-2"
                      >
                        <span className="text-sm mr-2 flex-shrink-0">
                          {item.icon}
                        </span>
                        <span className={`${card.textColor} leading-tight`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
