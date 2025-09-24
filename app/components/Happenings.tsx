import {useEffect, useState, useMemo, useCallback, memo} from "react";
import type {FetcherWithComponents} from "@remix-run/react";
import {useLanguage} from "../contexts/LanguageContext";
import {CalendarEmbed} from "./CalendarEmbed";

// Simple debounce utility
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
}

interface HappeningsProps {
  cardsData: any;
  isAdmin: boolean;
  onEditConfig?: () => void;
  onSaveData: (data: any) => void;
}

// EditableText component - MOVED OUTSIDE to prevent re-creation
const EditableText = memo(({
  originalText, 
  textKey, 
  cardId, 
  className = "",
  editMode,
  editingTextId,
  textValues,
  setTextValues,
  setEditingTextId,
  saveAndExit,
  language,
  startEditing
}: {
  originalText: {pt: string, en: string},
  textKey: string,
  cardId: string,
  className?: string,
  editMode: string,
  editingTextId: string | null,
  textValues: {pt: string, en: string},
  setTextValues: (values: {pt: string, en: string}) => void,
  setEditingTextId: (id: string | null) => void,
  saveAndExit: () => void,
  language: string,
  startEditing: (cardId: string, textKey: string, originalText: {pt: string, en: string}) => void
}) => {
  const textId = `${cardId}-${textKey}`;
  const isEditing = editingTextId === textId;
  
  // Safety check for undefined originalText
  if (!originalText) {
    console.log(`🔍 EditableText WARNING: originalText is undefined for ${cardId}-${textKey}`);
    return <span className={className}>❌ Missing text data</span>;
  }
  
  // Display should always show original text - inputs are separate
  const displayText = originalText[language as keyof typeof originalText];

  if (editMode !== 'text') {
    return <span className={className}>{originalText[language as keyof typeof originalText]}</span>;
  }

  return (
    <div className="editable-text-container relative" >
      {!isEditing ? (
        <button
          className={`${className} hover:bg-yellow-200/50 hover:outline hover:outline-2 hover:outline-dashed hover:outline-yellow-400 rounded  transition-all cursor-text `}
          onClick={(e) => {
            e.stopPropagation();
            startEditing(cardId, textKey, originalText);
          }}
        >
          {displayText}
        </button>
      ) : (
        <div 
          className="relative inline-block"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {/* Visual indicator showing what we're editing - NOT an input */}
          <div
            className="bg-blue-100 border-2 border-blue-400 rounded px-2 py-1 cursor-pointer text-blue-900 font-bold"
            onClick={(e) => e.stopPropagation()}
            style={{background: 'rgba(219, 234, 254, 0.9)', color: '#1e40af'}}
          >
            {displayText || "❌ No text"} ✏️
          </div>
          
          {/* Bilingual expansion panel */}
          <div 
            className="bilingual-panel absolute top-full left-0 bg-white shadow-lg rounded-lg p-3 z-50 border border-gray-200 min-w-64 mt-1"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking panel
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-600">🇬🇧 EN</span>
                      <input
                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                        value={textValues.en}
                        onChange={(e) => {
                          setTextValues({...textValues, en: e.target.value});
                        }}
                        onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      saveAndExit();
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      setEditingTextId(null);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="English text..."
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-green-600">🇵🇹 PT</span>
                      <input
                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                        value={textValues.pt}
                        onChange={(e) => {
                          setTextValues({...textValues, pt: e.target.value});
                        }}
                        onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      saveAndExit();
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      setEditingTextId(null);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Texto português..."
                />
              </div>
              <div className="text-xs text-gray-500 text-center pt-1">
                Press Enter or click away to save
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export function Happenings({cardsData, isAdmin, onEditConfig, onSaveData}: HappeningsProps) {
  const {language} = useLanguage();
  const [, setMousePosition] = useState({x: 0, y: 0});
  const [rotation, setRotation] = useState(0);
  const [prevAngle, setPrevAngle] = useState<number | null>(null);
  
  // Enhanced editing states for inline text editing
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({x: 0, y: 0});
  const [editMode, setEditMode] = useState<'none' | 'config' | 'text'>('none');
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [textValues, setTextValues] = useState<{pt: string, en: string}>({pt: '', en: ''});

  useEffect(() => {
    // Stop spinning when in text edit mode - much better UX!
    if (editMode === 'text') {
      return;
    }

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
  }, [prevAngle, editMode]);

  // CARD SPACING - Adjust this value to change how far apart the cards are
  const CARD_RADIUS = 260; // Distance from center to cards (in pixels)

  // Debounced auto-save for inline text changes
  const debouncedSave = useMemo(
    () => debounce((newData: any) => {
      onSaveData(newData);
    }, 500),
    [onSaveData]
  );

  // Enhanced context menu handler
  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isAdmin) {
      return;
    }
    e.preventDefault();
    setContextMenuPos({x: e.clientX, y: e.clientY});
    setShowContextMenu(true);
  };

  // Text editing functions
  const startEditing = (cardId: string, textKey: string, originalText: {pt: string, en: string}) => {
    const textId = `${cardId}-${textKey}`;
    setEditingTextId(textId);
    setTextValues(originalText);
  };

  const updateText = useCallback((cardId: string, textKey: string, newValues: {pt: string, en: string}) => {
    let updatedData;
    
    // Only handle card content (no more title editing)
    if (cardId !== 'title') {
      // Update card content
      const updatedCards = cardsData.cards.map((card: any) => {
        if (card.id === cardId) {
          if (textKey === 'title') {
            return {...card, title: newValues};
          } else {
            const itemIndex = parseInt(textKey.split('-')[1]);
            const updatedItems = card.items.map((item: any, index: number) => 
              index === itemIndex ? {...item, text: newValues} : item
            );
            return {...card, items: updatedItems};
          }
        }
        return card;
      });
      
      updatedData = {
        ...cardsData,
        cards: updatedCards
      };
    } else {
      // Skip title updates - they're now hardcoded
      return;
    }
    
    // Only save to database, don't update local state during typing
    debouncedSave(updatedData);
  }, [cardsData.cards, cardsData.title, debouncedSave]);

  const saveAndExit = useCallback(() => {
    if (editingTextId) {
      // Fix: Split on -item- or -title to handle 'coming-up-item-0' correctly
      let cardId, textKey;
      if (editingTextId.includes('-item-')) {
        const parts = editingTextId.split('-item-');
        cardId = parts[0];
        textKey = 'item-' + parts[1];
      } else if (editingTextId.includes('-title')) {
        const parts = editingTextId.split('-title');
        cardId = parts[0];
        textKey = 'title';
      } else {
        // Fallback to original logic
        const dashIndex = editingTextId.lastIndexOf('-');
        cardId = editingTextId.substring(0, dashIndex);
        textKey = editingTextId.substring(dashIndex + 1);
      }
      
      // Skip title editing - only handle cards
      if (cardId !== 'title') {
        const finalTextKey = textKey.includes('item') ? textKey : 'title';
        updateText(cardId, finalTextKey, textValues);
      }
      setEditingTextId(null);
    }
  }, [editingTextId, textValues, updateText]);

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      
      // Close context menu if clicking outside
      if (showContextMenu && !target.closest('.context-menu')) {
        setShowContextMenu(false);
      }
      
      // Close text editor if clicking outside the editing area
      if (editingTextId) {
        // Don't close if clicking on any part of the editing UI
        const isEditingElement = target.closest('.editable-text-container') ||
                                target.closest('.bilingual-panel') ||
                                target.closest('input') ||
                                target.closest('button');
        
        if (!isEditingElement) {
          // CRITICAL FIX: Save before closing!
          saveAndExit();
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
    }, [showContextMenu, editingTextId, saveAndExit]);

  // Global escape key handling to exit edit mode
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape" && editingTextId) {
        event.preventDefault();
        event.stopPropagation();
        exitEditMode();
        console.log("🔍 ESCAPE pressed, exiting edit mode");
      }
    }
    
    if (editingTextId) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [editingTextId]);

  // Context menu actions
  const handleEditConfig = () => {
    setShowContextMenu(false);
    onEditConfig?.();
  };

  const handleEditText = () => {
    setEditMode('text');
    setShowContextMenu(false);
  };

  const exitEditMode = () => {
    setEditMode('none');
    setEditingTextId(null);
  };


  // Convert structure to display format based on language
  const cards = cardsData.cards ? 
    cardsData.cards.map((card: any) => ({
      ...card,
      title: card.title[language],
      items: card.items.map((item: any) => ({
        ...item,
        text: item.text[language]
      }))
    })) : [];

  return (
    <div 
      className="flex flex-col justify-center items-center mb-16"
      onContextMenu={handleContextMenu}
      
    >
      <CalendarEmbed />

      <div className="text-center">
        {/* Simple Title - No Config Needed */}
        <h2 className="mb-4 text-4xl md:text-6xl font-bold text-transparent font-mono tracking-wider bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text animate-pulse">
          {language === 'en' ? 'THE WHEEL OF HAPPENINGS' : 'A RODA DOS ACONTECIMENTOS'}
        </h2>
        
        <div className="flex justify-center items-center space-x-2 text-2xl">
          <span className="animate-spin">🌀</span>
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
        <div className="relative w-full max-w-5xl mx-auto px-4 mt-[220px] mb-[150px]">
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
                    <h3 className="text-base font-bold font-mono lowercase">
                      <EditableText
                        originalText={cardsData.cards.find((c: any) => c.id === card.id)?.title}
                        textKey="title"
                        cardId={card.id}
                        className={card.textColor}
                        editMode={editMode}
                        editingTextId={editingTextId}
                        textValues={textValues}
                        setTextValues={setTextValues}
                        setEditingTextId={setEditingTextId}
                        saveAndExit={saveAndExit}
                        language={language}
                        startEditing={startEditing}
                      />
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
                        <div className="leading-relaxed">
                          <EditableText
                            originalText={cardsData.cards.find((c: any) => c.id === card.id)?.items[itemIndex]?.text}
                            textKey={`item-${itemIndex}`}
                            cardId={card.id}
                            className={card.textColor}
                            editMode={editMode}
                            editingTextId={editingTextId}
                            textValues={textValues}
                            setTextValues={setTextValues}
                            setEditingTextId={setEditingTextId}
                            saveAndExit={saveAndExit}
                            language={language}
                            startEditing={startEditing}
                          />
                        </div>
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
                  <h3 className="text-sm font-bold font-mono lowercase">
                    <EditableText
                      originalText={cardsData.cards.find((c: any) => c.id === card.id)?.title}
                      textKey="title"
                      cardId={card.id}
                      className={card.textColor}
                      editMode={editMode}
                      editingTextId={editingTextId}
                      textValues={textValues}
                      setTextValues={setTextValues}
                      setEditingTextId={setEditingTextId}
                      saveAndExit={saveAndExit}
                      language={language}
                      startEditing={startEditing}
                    />
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
                      <div className="leading-tight">
                        <EditableText
                          originalText={cardsData.cards.find((c: any) => c.id === card.id)?.items[itemIndex]?.text}
                          textKey={`item-${itemIndex}`}
                          cardId={card.id}
                          className={card.textColor}
                          editMode={editMode}
                          editingTextId={editingTextId}
                          textValues={textValues}
                          setTextValues={setTextValues}
                          setEditingTextId={setEditingTextId}
                          saveAndExit={saveAndExit}
                          language={language}
                          startEditing={startEditing}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {showContextMenu && isAdmin && (
        <div 
          className="context-menu fixed bg-white shadow-lg rounded-lg border border-gray-200 z-50 py-1 min-w-48"
          style={{left: contextMenuPos.x, top: contextMenuPos.y}}
        >
          <button
            onClick={handleEditConfig}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
          >
            <span>🔧</span>
            <span>Edit Config</span>
            <span className="text-xs text-gray-500 ml-auto">JSON</span>
          </button>
          <button
            onClick={handleEditText}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
          >
            <span>✏️</span>
            <span>Edit Text</span>
            <span className="text-xs text-gray-500 ml-auto">Inline</span>
          </button>
          {editMode === 'text' && (
            <button
              onClick={exitEditMode}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors border-t border-gray-100"
            >
              <span>❌</span>
              <span>Exit Edit Mode</span>
            </button>
          )}
        </div>
      )}

      {/* Edit Mode Indicator */}
      {editMode === 'text' && (
        <div className="fixed bottom-4 right-4 z-40 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg shadow-lg font-mono text-sm flex items-center gap-3">
          <span>✏️ Text Edit Mode - Wheel stopped, click any text to edit</span>
          <button
            onClick={exitEditMode}
            className="bg-yellow-600 hover:bg-yellow-700 text-yellow-100 px-3 py-1 rounded-md text-xs font-semibold transition-colors hover:shadow-md"
            title="Exit Edit Mode"
          >
            ❌ Exit
          </button>
        </div>
      )}
    </div>
  );
}