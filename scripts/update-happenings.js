#!/usr/bin/env node

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

// Helper to handle storing latest config for future reference
async function saveConfigToFile(config, filename = 'latest-calendar-cards.json') {
  try {
    const dirPath = './.dev';
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
    
    await fs.writeFile(
      path.join(dirPath, filename),
      JSON.stringify(config, null, 2),
      'utf8'
    );
    console.log(`📝 Saved backup of config to ./.dev/${filename}`);
  } catch (error) {
    console.warn(`⚠️ Could not save backup: ${error.message}`);
  }
}

async function updateHappenings() {
  const client = new MongoClient(DATABASE_URL);
  
  try {
    await client.connect();
    console.log('🌿 Connected to MongoDB...');
    
    const db = client.db();
    const collection = db.collection('Configuration'); // Correct collection name
    
    // Get current config
    const configDoc = await collection.findOne({ key: 'calendar_cards' });
    
    if (!configDoc) {
      console.error('❌ Config with key "calendar_cards" not found in Configuration collection');
      process.exit(1);
    }
    
    console.log('📖 Current config retrieved');
    
    // Parse the current value (it's stored as a JSON string)
    const currentConfig = JSON.parse(configDoc.value);
    
    // Save backup of current config before modifying
    await saveConfigToFile(currentConfig, 'calendar-cards-backup.json');
    
    // Create updated config blending quinta magic with fresh planning session vibes
    const updatedConfig = {
      cards: [
        {
          id: "coming-up",
          icon: "🦄",
          color: "from-fuchsia-200 via-pink-300 to-purple-300",
          textColor: "text-purple-900",
          title: {
            en: "sprouting soon..",
            pt: "brotando em breve.."
          },
          items: [
            {
              icon: "💫",
              text: {
                en: "ecstatic dance sat 4th - intimate movement medicine",
                pt: "dança extática sáb 4 - medicina do movimento íntimo"
              }
            },
            {
              icon: "💃",
              text: {
                en: "dance workshop oct 11 - lindy hop, bachata, jam & vegan feast",
                pt: "workshop de dança 11 out - lindy hop, bachata, jam e banquete vegano"
              }
            },
            {
              icon: "🏗️",
              text: {
                en: "terrace cementing sessions - creating foundations together",
                pt: "sessões de cimentação do terraço - criando fundações juntos"
              }
            },
            {
              icon: "🗣️",
              text: {
                en: "quinta core conversations - diving deep",
                pt: "conversas centrais da quinta - mergulhando fundo"
              }
            }
          ]
        },
        {
          id: "always-brewing",
          icon: "🌀",
          color: "from-cyan-200 via-blue-300 to-indigo-400",
          textColor: "text-indigo-900",
          title: {
            en: "always brewing",
            pt: "sempre fermentando"
          },
          items: [
            {
              icon: "🧪",
              text: {
                en: "winter fermentária - tempeh, tofu & golden ginger beer",
                pt: "fermentária de inverno - tempeh, tofu e cerveja dourada de gengibre"
              }
            },
            {
              icon: "🌳",
              text: {
                en: "fruit tree propagation & seedling adventures",
                pt: "propagação de árvores frutíferas & aventuras de mudas"
              }
            },
            {
              icon: "🗺️",
              text: {
                en: "permaculture space design",
                pt: "design permacultura dos espaços"
              }
            },
            {
              icon: "🫒",
              text: {
                en: "olive harvest wanderings - gathering from village lands",
                pt: "colheita de azeitonas - recolhendo das terras da aldeia"
              }
            }
          ]
        },
        {
          id: "earth-shaping",
          icon: "🔨",
          color: "from-orange-200 via-amber-300 to-yellow-400",
          textColor: "text-amber-900",
          title: {
            en: "earth shaping",
            pt: "moldando a terra"
          },
          items: [
            {
              icon: "🪟",
              text: {
                en: "window building - sealing spaces for winter winds",
                pt: "construção de janelas - vedando espaços para os ventos de inverno"
              }
            },
            {
              icon: "🏡",
              text: {
                en: "clay plastering at sweetland - hands in earth medicine",
                pt: "reboco de barro em sweetland - mãos na medicina da terra"
              }
            },
            {
              icon: "🌱",
              text: {
                en: "garden fence reinforcing - protecting from the chickens!",
                pt: "reforço da cerca do jardim - protegendo das galinhas!"
              }
            },
            {
              icon: "💰",
              text: {
                en: "funding applications - manifesting resources for vision",
                pt: "candidaturas a financiamento - manifestando recursos para a visão"
              }
            }
          ]
        },
        {
          id: "sacred-rhythms",
          icon: "🌊",
          color: "from-lime-200 via-green-300 to-emerald-400",
          textColor: "text-emerald-900",
          title: {
            en: "sacred rhythms",
            pt: "ritmos sagrados"
          },
          items: [
            {
              icon: "🌈",
              text: {
                en: "peter away on rainbow journey oct 6-20 - returning with magic",
                pt: "o peter está fora em jornada arco-íris 6-20 out - retornando com magia"
              }
            },
            {
              icon: "🎵",
              text: {
                en: "sunday jam sessions - musical flow in our space",
                pt: "sessões de jam domingo - fluxo musical no nosso espaço"
              }
            },
            {
              icon: "🧘",
              text: {
                en: "acroyoga gatherings - mats & connection under sky",
                pt: "encontros de acroyoga - tapetes e conexão sob o céu"
              }
            },
            {
              icon: "🎭",
              text: {
                en: "spontaneous village workshops",
                pt: "workshops espontâneos da aldeia"
              }
            }
          ]
        },
        {
          id: "mystery-happenings",
          icon: "🎲",
          color: "from-rose-200 via-red-300 to-pink-400",
          textColor: "text-red-900",
          title: {
            en: "mystery happenings",
            pt: "acontecimentos misteriosos"
          },
          items: [
            {
              icon: "🦋",
              text: {
                en: "animals appearing in perfect moments",
                pt: "animais aparecendo em momentos perfeitos"
              }
            },
            {
              icon: "🔮",
              text: {
                en: "future vision circles emerging",
                pt: "círculos de visão futura emergindo"
              }
            },
            {
              icon: "🎪",
              text: {
                en: "surprise community celebrations",
                pt: "celebrações comunitárias surpresa"
              }
            },
            {
              icon: "✨",
              text: {
                en: "magic that just happens",
                pt: "magia que simplesmente acontece"
              }
            },
            {
              icon: "🎵",
              text: {
                en: "unexpected music flowing through",
                pt: "música inesperada fluindo"
              }
            }
          ]
        }
      ],
      title: currentConfig.title // Preserve the existing title structure
    };
    
    // Convert the updated config back to a JSON string
    const updatedValue = JSON.stringify(updatedConfig);
    
    // Update the document in the database
    const result = await collection.updateOne(
      { key: 'calendar_cards' },
      { 
        $set: { 
          value: updatedValue,
          updatedAt: new Date()
        } 
      }
    );
    
    console.log('✨ Calendar cards config updated successfully!');
    console.log(`📝 Operation: ${result.matchedCount > 0 ? 'Updated existing' : 'No document matched'} config`);
    console.log('🌊 The wheel of happenings flows with fresh energy...');
    
    // Save new config for future reference
    await saveConfigToFile(updatedConfig);
    
  } catch (error) {
    console.error('💥 Error updating calendar cards:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔐 Database connection closed');
  }
}

/**
 * Usage:
 * 1. To get current config: node scripts/update-happenings.js --get
 * 2. To update with changes in this file: node scripts/update-happenings.js
 * 3. To update from a JSON file: node scripts/update-happenings.js --from-file path/to/file.json
 */

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--get')) {
    // Only retrieve and save the current config
    const client = new MongoClient(DATABASE_URL);
    
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection('Configuration');
      const configDoc = await collection.findOne({ key: 'calendar_cards' });
      
      if (!configDoc) {
        console.error('❌ Config with key "calendar_cards" not found');
        process.exit(1);
      }
      
      const config = JSON.parse(configDoc.value);
      await saveConfigToFile(config);
      console.log('✅ Retrieved current config and saved to ./.dev/latest-calendar-cards.json');
      
    } catch (error) {
      console.error('💥 Error retrieving config:', error);
      process.exit(1);
    } finally {
      await client.close();
    }
    return;
  }
  
  const fromFileFlag = args.findIndex(arg => arg === '--from-file');
  if (fromFileFlag !== -1 && args.length > fromFileFlag + 1) {
    const filePath = args[fromFileFlag + 1];
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const config = JSON.parse(fileContent);
      
      // TODO: Import from file and update database
      console.log(`Will update from file: ${filePath} (not implemented yet)`);
      
    } catch (error) {
      console.error(`💥 Error reading from file ${filePath}:`, error);
      process.exit(1);
    }
    return;
  }
  
  // Default: run the update with hardcoded config
  await updateHappenings();
}

// Run the script
main()
  .then(() => {
    console.log('🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });