import {Layout} from "../components/Layout";
import {useState} from "react";
import {Happenings} from "../components/Happenings";
import {json} from "@remix-run/node";
import {useLoaderData, useFetcher} from "@remix-run/react";
import type {LoaderFunctionArgs, ActionFunctionArgs} from "@remix-run/node";
import db from "~/utils/db.server";
import {getUser} from "~/utils/auth.server";




export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request);
  
  // Get calendar configuration from database
  const config = await (db as any).configuration.findUnique({
    where: {key: "calendar_cards"}
  });
  
  if (!config) {
    throw new Error("Calendar configuration not found in database");
  }
  
  // Parse configuration - let it throw if corrupted
  let cardsData = JSON.parse(config.value);
  
  // Auto-migrate old format to new format if needed
  if (!cardsData.cards && cardsData.ptText && cardsData.enText) {
    // Migrate from very old format
    const newData = {
      title: {
        desktop: {
          pt: "A RODA DOS ACONTECIMENTOS",
          en: "THE WHEEL OF HAPPENINGS"
        },
        mobile: {
          pt: "ACONTECIMENTOS", 
          en: "HAPPENINGS"
        }
      },
      cards: cardsData.ptText.map((ptCard: any, index: number) => {
        const enCard = cardsData.enText[index];
        return {
          id: ptCard.id,
          icon: ptCard.icon,
          title: {
            pt: ptCard.title,
            en: enCard.title
          },
          color: ptCard.color,
          textColor: ptCard.textColor,
          items: ptCard.items.map((ptItem: any, itemIndex: number) => ({
            icon: ptItem.icon,
            text: {
              pt: ptItem.text,
              en: enCard.items[itemIndex]?.text || ptItem.text
            }
          }))
        };
      })
    };
    
    // Update database with new format
    await (db as any).configuration.update({
      where: { key: "calendar_cards" },
      data: { value: JSON.stringify(newData) }
    });
    
    cardsData = newData;
  }

  // Auto-migrate cards-only format to include title
  if (cardsData.cards && !cardsData.title) {
    cardsData.title = {
      desktop: {
        pt: "A RODA DOS ACONTECIMENTOS",
        en: "THE WHEEL OF HAPPENINGS"
      },
      mobile: {
        pt: "ACONTECIMENTOS", 
        en: "HAPPENINGS"
      }
    };
    
    // Update database with title
    await (db as any).configuration.update({
      where: { key: "calendar_cards" },
      data: { value: JSON.stringify(cardsData) }
    });
  }
  
  return json({
    cardsData,
    isAdmin: user?.privilages.includes("admin") || false
  });
}

export async function action({request}: ActionFunctionArgs) {
  console.log("🔍 Calendar action called");
  const user = await getUser(request);
  if (!user?.privilages.includes("admin")) {
    console.log("🔍 Unauthorized user");
    return json({error: "Unauthorized"}, {status: 403});
  }
  
  const formData = await request.formData();
  const configData = formData.get("configData") as string;
  console.log("🔍 Received configData:", configData ? "present" : "missing");
  
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
    
    console.log("🔍 Database save successful");
    return json({success: true});
  } catch (error) {
    return json({error: "Invalid JSON configuration"}, {status: 400});
  }
}

export default function Index() {
  const {cardsData, isAdmin} = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editConfig, setEditConfig] = useState("");

  const handleSaveConfig = () => {
    fetcher.submit(
      {configData: editConfig},
      {method: "post"}
    );
    setShowEditModal(false);
  };

  const openConfigModal = () => {
    setEditConfig(JSON.stringify(cardsData, null, 2));
    setShowEditModal(true);
  };

  const handleSaveData = (newData: any) => {
    console.log("🔍 Parent handleSaveData called with:", newData);
    const jsonData = JSON.stringify(newData);
    console.log("🔍 Sending JSON to server:", jsonData.substring(0, 200) + "...");
    fetcher.submit(
      {configData: jsonData},
      {method: "post"}
    );
    console.log("🔍 fetcher.submit() called, state:", fetcher.state);
  };

  return (
    <Layout>
      <Happenings 
        cardsData={cardsData} 
        isAdmin={isAdmin} 
        onEditConfig={openConfigModal}
        onSaveData={handleSaveData}
      />

      {/* Admin Edit Modal - JSON Editor */}
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
    </Layout>
  );
}
