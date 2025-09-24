# Calendar Inline Text Editing - Implementation Plan 🎯

## Overview
Create an intuitive in-place text editing system for the spinning quinta calendar wheel. Users can edit Portuguese and English text simultaneously without dealing with JSON.

## Current State ✅
- **Admin Configuration System**: Right-click → JSON editor modal (working)
- **Data Structure**: Card-focused with PT/EN side-by-side (optimized)
- **Authentication**: Admin privilege checking (working)
- **Spinning Animation**: Mouse-following rotation with cards (working)

## Proposed UX Flow

### 1. **Context Menu System**
- **Right-click anywhere on calendar** → Context menu appears
- **Two options**:
  - 🔧 **"Edit Config"** (existing) - opens JSON editor modal
  - ✏️ **"Edit Text"** (new) - enters inline editing mode

### 2. **Inline Editing Mode**
- **Visual State**: All text elements get subtle input-box styling
- **No Layout Shift**: Text stays exactly in position
- **Spinning Continues**: Cards keep rotating during editing
- **Click to Edit**: Click any text element to start editing

### 3. **Bilingual Input System**
- **Default State**: Single input box overlaying original text
- **Active State**: When focused, input duplicates:
  - **Top Input**: 🇬🇧 EN - English text
  - **Bottom Input**: 🇵🇹 PT - Portuguese text  
- **Auto-sync**: Changes save automatically on blur
- **Visual Feedback**: Subtle highlight during editing

## Technical Implementation Plan

### Phase 1: Context Menu System
```typescript
// Add context menu state
const [showContextMenu, setShowContextMenu] = useState(false);
const [contextMenuPos, setContextMenuPos] = useState({x: 0, y: 0});
const [editMode, setEditMode] = useState<'none' | 'config' | 'text'>('none');

// Enhanced context menu handler
const handleContextMenu = (e: React.MouseEvent) => {
  e.preventDefault();
  setContextMenuPos({x: e.clientX, y: e.clientY});
  setShowContextMenu(true);
};
```

### Phase 2: Text Input Overlay System
```typescript
// Text editing state management
const [editingTextId, setEditingTextId] = useState<string | null>(null);
const [textValues, setTextValues] = useState<{pt: string, en: string}>({pt: '', en: ''});

// Input overlay component
const EditableText = ({
  originalText, 
  textKey, 
  cardId, 
  isTitle = false
}: EditableTextProps) => {
  const isEditing = editingTextId === `${cardId}-${textKey}`;
  
  return (
    <div className="relative">
      {editMode === 'text' ? (
        <div className="relative">
          {/* Input overlay */}
          <input
            className="absolute inset-0 bg-transparent border-dashed border-gray-400"
            value={isEditing ? textValues.pt : originalText}
            onFocus={() => startEditing(cardId, textKey)}
            onBlur={() => saveAndExit()}
          />
          
          {/* Bilingual inputs when active */}
          {isEditing && (
            <div className="absolute top-full left-0 bg-white shadow-lg rounded p-2 z-50">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs">🇬🇧 EN</span>
                <input value={textValues.en} onChange={handleEnChange} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">🇵🇹 PT</span>
                <input value={textValues.pt} onChange={handlePtChange} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <span>{originalText}</span>
      )}
    </div>
  );
};
```

### Phase 3: Auto-Save System
```typescript
// Debounced auto-save
const debouncedSave = useMemo(
  () => debounce((newData: any) => {
    fetcher.submit(
      {configData: JSON.stringify(newData)},
      {method: "post"}
    );
  }, 500),
  [fetcher]
);

const updateText = (cardId: string, textKey: string, newValues: {pt: string, en: string}) => {
  const updatedCards = cardsData.cards.map(card => {
    if (card.id === cardId) {
      if (textKey === 'title') {
        return {...card, title: newValues};
      } else {
        const updatedItems = card.items.map((item, index) => 
          textKey === `item-${index}` ? {...item, text: newValues} : item
        );
        return {...card, items: updatedItems};
      }
    }
    return card;
  });
  
  debouncedSave({cards: updatedCards});
};
```

## Component Structure Changes

### 1. **Enhanced Context Menu**
```jsx
{showContextMenu && isAdmin && (
  <div 
    className="fixed bg-white shadow-lg rounded border z-50"
    style={{left: contextMenuPos.x, top: contextMenuPos.y}}
  >
    <button onClick={() => setEditMode('config')}>
      🔧 Edit Config
    </button>
    <button onClick={() => setEditMode('text')}>
      ✏️ Edit Text  
    </button>
  </div>
)}
```

### 2. **Text Rendering Updates**
```jsx
// Replace static text with EditableText components
<h3 className={`text-base font-bold ${card.textColor} font-mono lowercase`}>
  <EditableText 
    originalText={card.title}
    textKey="title"
    cardId={card.id}
    isTitle={true}
  />
</h3>

{card.items.map((item, itemIndex) => (
  <div key={itemIndex} className="flex items-start text-sm bg-white/50 rounded-lg p-3">
    <span className="text-base mr-3 flex-shrink-0">{item.icon}</span>
    <EditableText
      originalText={item.text}
      textKey={`item-${itemIndex}`}
      cardId={card.id}
    />
  </div>
))}
```

## Challenges & Solutions

### 1. **Spinning Animation Compatibility**
- **Challenge**: Input elements need to rotate with cards
- **Solution**: Use CSS transforms and absolute positioning relative to rotating parent

### 2. **Input Positioning Precision**
- **Challenge**: Inputs must overlay text exactly
- **Solution**: Use `getBoundingClientRect()` for precise positioning

### 3. **Bilingual Input UX**
- **Challenge**: Showing PT/EN inputs without cluttering UI
- **Solution**: Expandable input system - single input that becomes dual when focused

### 4. **Auto-save Performance**
- **Challenge**: Too many API calls during typing
- **Solution**: Debounced saves (500ms delay) + optimistic UI updates

## Development Phases

### **Phase 1** (Foundation) - 2-3 hours
- [ ] Context menu system
- [ ] Edit mode state management  
- [ ] Basic input overlay (single language)

### **Phase 2** (Bilingual System) - 2-3 hours  
- [ ] Dual PT/EN input expansion
- [ ] Text key identification system
- [ ] Auto-save with debouncing

### **Phase 3** (Polish) - 1-2 hours
- [ ] Visual feedback and transitions
- [ ] Error handling
- [ ] Mobile compatibility
- [ ] Testing with spinning animation

## Testing Checklist
- [ ] Context menu appears on right-click (admin only)
- [ ] Edit mode toggle works correctly
- [ ] Text inputs overlay precisely
- [ ] Bilingual editing expands properly
- [ ] Auto-save triggers correctly
- [ ] Spinning animation continues during editing
- [ ] Changes persist after page reload
- [ ] Works on both desktop and mobile
- [ ] No layout shifts during mode transitions

## File Changes Required
1. **`app/routes/calendar.tsx`** - Main implementation
2. **`app/components/EditableText.tsx`** - New component (optional extraction)
3. **`app/styles/calendar-editing.css`** - Additional styles (optional)

## Success Metrics
- **UX**: Marisa can edit text without touching JSON
- **Performance**: No noticeable lag during editing
- **Accuracy**: Text changes save correctly to database
- **Responsive**: Works seamlessly with spinning animation

This would create an incredibly smooth editing experience while maintaining the magical quinta wheel aesthetic! 🌀✨
