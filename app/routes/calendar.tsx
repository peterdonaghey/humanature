import {Layout} from "../components/Layout";
import {useEffect, useState} from "react";
import {useLanguage} from "../contexts/LanguageContext";
import {CalendarEmbed} from "../components/CalendarEmbed";
import {json, redirect} from "@remix-run/node";
import {useLoaderData, useFetcher} from "@remix-run/react";
import type {LoaderFunctionArgs, ActionFunctionArgs} from "@remix-run/node";
import db from "~/utils/db.server";
import {getUser} from "~/utils/auth.server";

// Default calendar data - restructured for better editing UX
const defaultCardsData = {
  cards: [
    {
      id: "coming-up",
      icon: "🦄",
      title: {
        pt: "aproximando-se..",
        en: "coming up.."
      },
      color: "from-fuchsia-200 via-pink-300 to-purple-300",
      textColor: "text-purple-900",
      items: [
        {
          icon: "🤸‍♀️", 
          text: {
            pt: "workshop de acroyoga - 30 setembro",
            en: "acroyoga workshop - sept 30th"
          }
        },
        {
          icon: "🍺", 
          text: {
            pt: "fermentação ginger beer & kombucha",
            en: "ginger beer & kombucha brewing"
          }
        },
        {
          icon: "🌰", 
          text: {
            pt: "workshop de sementes - outubro",
            en: "seed workshop - october"
          }
        },
        {
          icon: "🏠", 
          text: {
            pt: "finalizar trabalhos de construção",
            en: "finish construction work"
          }
        },
        {
          icon: "📜", 
          text: {
            pt: "reunião da associação",
            en: "association meeting"
          }
        },
      ],
    },
    {
      id: "good-stuff",
      icon: "🎊",
      title: {
        pt: "vitórias recentes",
        en: "recent wins"
      },
      color: "from-lime-200 via-green-300 to-emerald-400",
      textColor: "text-emerald-900",
      items: [
        {
          icon: "📅", 
          text: {
            pt: "sessão de planeamento semanal feita",
            en: "weekly planning session done"
          }
        },
        {
          icon: "🌿", 
          text: {
            pt: "jardim de ervas a prosperar",
            en: "herb garden thriving"
          }
        },
        {
          icon: "🏗️", 
          text: {
            pt: "progresso nos terraços",
            en: "terrace progress ongoing"
          }
        },
        {
          icon: "🧰", 
          text: {
            pt: "reorganização dos espaços",
            en: "spaces reorganized"
          }
        },
        {
          icon: "🐔", 
          text: {
            pt: "chickens roaming free - on the other side of the fence!",
            en: "chickens roaming free - on the other side of the fence!"
          }
        },
      ],
    },
    {
      id: "always-happening",
      icon: "🌀",
      title: {
        pt: "sempre acontecendo",
        en: "always happening"
      },
      color: "from-cyan-200 via-blue-300 to-indigo-400",
      textColor: "text-indigo-900",
      items: [
        {
          icon: "🧪", 
          text: {
            pt: "kombucha & ginger beer",
            en: "kombucha & ginger beer"
          }
        },
        {
          icon: "🌳", 
          text: {
            pt: "propagação de árvores frutíferas",
            en: "fruit tree propagation"
          }
        },
        {
          icon: "🗺️", 
          text: {
            pt: "design permacultura dos espaços",
            en: "permaculture space design"
          }
        },
        {
          icon: "🎭", 
          text: {
            pt: "workshops espontâneos da aldeia",
            en: "spontaneous village workshops"
          }
        },
        {
          icon: "🏗️", 
          text: {
            pt: "cimentação terraço futura",
            en: "futura terrace cementing"
          }
        },
      ],
    },
    {
      id: "autumn-vibes",
      icon: "🍄",
      title: {
        pt: "intenções outono",
        en: "autumn intentions"
      },
      color: "from-orange-200 via-amber-300 to-yellow-400",
      textColor: "text-amber-900",
      items: [
        {
          icon: "💭", 
          text: {
            pt: "conversas núcleo quinta",
            en: "quinta core talks"
          }
        },
        {
          icon: "📜", 
          text: {
            pt: "desenvolvimento da associação",
            en: "association development"
          }
        },
        {
          icon: "🎨", 
          text: {
            pt: "embelezamento do pátio",
            en: "courtyard beautification"
          }
        },
        {
          icon: "🔥", 
          text: {
            pt: "preparar para o inverno",
            en: "prepare for winter"
          }
        },
        {
          icon: "🏠", 
          text: {
            pt: "finalizar terraço da futura",
            en: "finish futura terrace"
          }
        },
      ],
    },
    {
      id: "mystery-box",
      icon: "🎲",
      title: {
        pt: "acontecimentos misteriosos",
        en: "mystery happenings"
      },
      color: "from-rose-200 via-red-300 to-pink-400",
      textColor: "text-red-900",
      items: [
        {
          icon: "🦋", 
          text: {
            pt: "sessões de jam espontâneas",
            en: "spontaneous jam sessions"
          }
        },
        {
          icon: "🔮", 
          text: {
            pt: "círculos de visão futura",
            en: "future vision circles"
          }
        },
        {
          icon: "🎪", 
          text: {
            pt: "eventos comunitários surpresa",
            en: "surprise community events"
          }
        },
        {
          icon: "✨", 
          text: {
            pt: "magia que simplesmente acontece",
            en: "magic that just happens"
          }
        },
        {
          icon: "🎵", 
          text: {
            pt: "música inesperada",
            en: "unexpected music"
          }
        },
      ],
    }
  ]
};

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request);
  
  // Get calendar configuration from database
  const config = await (db as any).configuration.findUnique({
    where: {key: "calendar_cards"}
  });
  
  if (!config) {
    // First time - initialize with default data
    await (db as any).configuration.create({
      data: {
        key: "calendar_cards",
        value: JSON.stringify(defaultCardsData)
      }
    });
    return json({
      cardsData: defaultCardsData,
      isAdmin: user?.privilages.includes("admin") || false
    });
  }
  
  // Parse configuration - let it throw if corrupted
  const cardsData = JSON.parse(config.value);
  
  return json({
    cardsData,
    isAdmin: user?.privilages.includes("admin") || false
  });
}

export async function action({request}: ActionFunctionArgs) {
  const user = await getUser(request);
  if (!user?.privilages.includes("admin")) {
    return json({error: "Unauthorized"}, {status: 403});
  }
  
  const formData = await request.formData();
  const configData = formData.get("configData") as string;
  
  if (!configData) {
    return json({error: "Missing configuration data"}, {status: 400});
  }
  
  try {
    // Validate JSON
    JSON.parse(configData);
    
    // Save to database
    await (db as any).configuration.upsert({
      where: {key: "calendar_cards"},
      update: {value: configData},
      create: {key: "calendar_cards", value: configData}
    });
    
    return json({success: true});
  } catch (error) {
    return json({error: "Invalid JSON configuration"}, {status: 400});
  }
}

export default function Index() {
  const {cardsData, isAdmin} = useLoaderData<typeof loader>();
  console.log("🎯 Calendar loaded - isAdmin:", isAdmin, "cardsData keys:", Object.keys(cardsData));
  const fetcher = useFetcher();
  const {language} = useLanguage();
  const [, setMousePosition] = useState({x: 0, y: 0});
  const [rotation, setRotation] = useState(0);
  const [prevAngle, setPrevAngle] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editConfig, setEditConfig] = useState("");

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

  const handleContextMenu = (e: React.MouseEvent) => {
    console.log("🧙‍♂️ Right-click detected! isAdmin:", isAdmin);
    if (!isAdmin) {
      console.log("❌ No admin privileges - right-click blocked");
      return;
    }
    console.log("✅ Admin access confirmed - opening edit modal");
    e.preventDefault();
    setEditConfig(JSON.stringify(cardsData, null, 2));
    setShowEditModal(true);
  };

  const handleSaveConfig = () => {
    fetcher.submit(
      {configData: editConfig},
      {method: "post"}
    );
    setShowEditModal(false);
  };


  // Convert new structure to display format based on language
  const cards = cardsData.cards.map((card: any) => ({
    ...card,
    title: card.title[language],
    items: card.items.map((item: any) => ({
      ...item,
      text: item.text[language]
    }))
  }));

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
      <div 
        className="flex flex-col justify-center items-center mb-16"
        onContextMenu={handleContextMenu}
      >
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
              {cards.map((card: any, index: number) => {
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
                      {card.items.map((item: any, itemIndex: number) => (
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
              {cards.map((card: any) => (
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
                    {card.items.map((item: any, itemIndex: number) => (
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

        {/* Admin Edit Modal */}
        {showEditModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <h2 className="text-2xl font-bold mb-4">Edit Calendar Configuration</h2>
              <p className="text-sm text-gray-600 mb-4">
                Edit the JSON configuration. Be careful with the syntax! 🧙‍♂️
              </p>
              
              <textarea
                value={editConfig}
                onChange={(e) => setEditConfig(e.target.value)}
                className="w-full h-96 font-mono text-sm border border-gray-300 rounded p-3 overflow-auto"
                placeholder="JSON configuration..."
              />
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveConfig}
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                  disabled={fetcher.state === "submitting"}
                >
                  {fetcher.state === "submitting" ? "Saving..." : "Save Configuration"}
                </button>
              </div>
              
              {fetcher.data && (fetcher.data as any).error && (
                <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  Error: {(fetcher.data as any).error}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
