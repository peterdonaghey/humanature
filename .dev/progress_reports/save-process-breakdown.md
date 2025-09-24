# Save Process Breakdown - Why It's Not Working

## The Expected Flow

1. **User types** in EN/PT input boxes
2. **Local state updates** (`textValues` in `EditableText`)
3. **User clicks away** or presses Enter
4. **`saveAndExit()` called** - updates `cardsData` state
5. **`updateText()` called** - triggers `debouncedSave()`
6. **`debouncedSave()` calls** `onSaveData(newData)`
7. **Parent `handleSaveData()`** receives data, calls `fetcher.submit()`
8. **Remix fetcher** sends POST to `/calendar` route
9. **Server action** receives data, saves to database
10. **Database updated** ✅

## What's Actually Happening (Based on Logs)

✅ Steps 1-6 working (we see the logs)
❌ Step 7+ failing (no server logs)

## Current Log Trail

```
saveAndExit triggered: {editingTextId: 'coming-up-item-1', textValues: {…}}
🔍 updateText calling debouncedSave with: {cards: Array(5), title: {…}}
🔍 debouncedSave calling parent save function: {cards: Array(5), title: {…}}
```

**Missing:** 
- `🔍 Parent handleSaveData called with: ...`
- `🔍 Calendar action called`

## The Problem

The `onSaveData` callback is not being called or the parent component isn't receiving it.

## Possible Issues

1. **Props not passed correctly** - `onSaveData` not reaching child
2. **Function reference changing** - causing re-renders/lost connections
3. **React state timing** - debounce not firing correctly
4. **Component re-mounting** - losing callback references

## Next Steps

1. Add log in parent `handleSaveData` to confirm it's being called
2. Check if `onSaveData` prop is actually received in child
3. Verify the callback chain is intact
