# Robin's Voice v1.4.2 - Testing Checklist

## 🔧 Setup
- [ ] Open in browser (Chrome recommended)
- [ ] Allow microphone permissions when prompted
- [ ] Check API key is pre-loaded (should show "✓ Robin's Key Active")
- [ ] No console errors on page load

---

## 🎨 New UI Elements (v1.4.2)
- [ ] Header shows "Robin's Voice Assistant" with dragonfly icon
- [ ] Dragonfly favicon in browser tab
- [ ] Theme toggle button (☀️/🌙) in header
- [ ] Tap theme toggle → switches between light/dark mode
- [ ] Theme preference persists after refresh
- [ ] Tabs show "Daily" and "Other" (not "Calls")
- [ ] Footer shows "✦ Robin's Voice Assistant v1.4.2"

---

## 🎤 Type Anything Card
- [ ] Type text in input field, tap SPEAK → voice plays
- [ ] Press Enter key → voice plays
- [ ] Tap STOP → audio stops immediately
- [ ] Status dot changes: green (ready) → loading → speaking → green
- [ ] Input field clears after speaking

---

## 📞 Speak Aloud Card

### Quick Actions
- [ ] Tap "Hi, this is Robin..." → plays intro
- [ ] Tap "Let me verify..." → plays verify message
- [ ] Tap ✏️ edit on intro → opens edit modal
- [ ] Tap ✏️ edit on verify → opens edit modal
- [ ] Edit labels save correctly

### Laugh Buttons
- [ ] Tap Chuckle → plays laugh (TTS or recorded)
- [ ] Tap Laugh → plays laugh (TTS or recorded)
- [ ] Tap Sarcastic → plays laugh (TTS or recorded)
- [ ] Icons display correctly (SVG waves)

### Phrase Tabs
- [ ] Daily tab is active by default
- [ ] Tap Daily → shows daily phrases
- [ ] Tap Calls → shows call phrases
- [ ] All phrase buttons work when tapped
- [ ] Tab underline indicator moves correctly

---

## ⭐ My Scripts Card
- [ ] Collapse/expand works
- [ ] "+ New" opens script modal
- [ ] Save new script → appears in list
- [ ] Tap script → speaks the text
- [ ] Edit button works
- [ ] Delete button works (with confirmation)
- [ ] Scripts persist after page refresh

---

## 🔧 Toolbar
- [ ] Record button → opens Recording modal
- [ ] Smart button → opens Smart settings modal
- [ ] Prefs button → opens Settings menu (CENTERED)

---

## ● Recording Modal
- [ ] Start Recording → timer starts, status shows "Recording..."
- [ ] Stop Recording → transcription appears
- [ ] Preview button plays transcribed text
- [ ] Edit transcription works
- [ ] Save as Button → creates new script
- [ ] Icon picker works
- [ ] Close button works

---

## ☰ Settings Menu
- [ ] Opens CENTERED over app (not right-aligned)
- [ ] All menu items visible
- [ ] Tap outside → closes menu

### Basic Info
- [ ] First/Last name fields save
- [ ] Nickname field saves
- [ ] Pronounce fields with ▶ Test button work
- [ ] Changes persist

### Input PII
- [ ] Yellow warning box visible
- [ ] DOB, Phone, Address fields save
- [ ] Quick Speak buttons (◯ ◈ ☎ ⌂) work
- [ ] Data persists

### Insurance
- [ ] List shows saved insurances
- [ ] Add Insurance opens sub-modal
- [ ] Save new insurance works
- [ ] Primary checkbox works
- [ ] Delete works

### Pharmacy
- [ ] List shows saved pharmacies
- [ ] Add Pharmacy opens sub-modal
- [ ] Save new pharmacy works
- [ ] Primary checkbox works
- [ ] Delete works

### Scripts Library
- [ ] Category tabs work (Doctor, Pharmacy, Transport, Insurance, Custom)
- [ ] Scripts display correctly
- [ ] Speak button plays script
- [ ] Add Script opens create form
- [ ] AI Generate button (stubbed - shows alert if no Claude key)
- [ ] Save script works

### Voice Settings
- [ ] Filter bar displays at top (⭐ 🇺🇸 🇬🇧 🌎 🌏 🇵🇱 All)
- [ ] ⭐ Robin filter shows custom voices (default)
- [ ] 🇺🇸 shows US/Canada voices
- [ ] 🇬🇧 shows Western EU voices
- [ ] 🌎 shows LATAM voices
- [ ] 🌏 shows Asia voices
- [ ] 🇵🇱 shows Eastern EU voices
- [ ] All shows all female voices
- [ ] Voice grid scrolls VERTICALLY only
- [ ] NO horizontal scrolling
- [ ] Tap voice → selects it (highlighted)
- [ ] ▶ Test Voice → plays random phrase
- [ ] First-ever test plays "In a world of plain voices..."
- [ ] Subsequent tests cycle through different phrases
- [ ] Speed slider works
- [ ] Selected voice persists

### Audio Settings
- [ ] Speaker volume slider works
- [ ] Mic sensitivity slider works
- [ ] ▶ Test Speaker plays audio
- [ ] ● Test Mic shows live level indicator
- [ ] "Boost for speakerphone" checkbox saves
- [ ] "Reduce echo" checkbox saves

### API Keys
- [ ] ElevenLabs key shows "✓ Robin's Key Active"
- [ ] Claude key field works
- [ ] Twilio fields work
- [ ] Status indicators update

### Call History
- [ ] Opens from Prefs menu
- [ ] Toggle buttons visible (GREEN when active, GRAY when off)
- [ ] Auto-summarize toggle works
- [ ] Email summaries toggle works
- [ ] Call list displays correctly (if any calls)
- [ ] Export PDF works
- [ ] Clear All works

### Help & About
- [ ] Quick Start section displays 3 steps
- [ ] Walkthrough section lists topics
- [ ] Ask Helper section works (separate from Feedback!)
- [ ] Helper suggestions work

### Feedback Section (NEW!)
- [ ] Feedback button shows in nav
- [ ] Category grid shows 6 options (Sync, UI, Bug, Idea, Urgent, General)
- [ ] Tap category → shows recorder
- [ ] Record button starts/stops recording
- [ ] Timer shows elapsed time
- [ ] After recording:
  - [ ] Preview section appears
  - [ ] ▶ Play previews recording
  - [ ] ↻ Re-record button works
  - [ ] Transcription textarea is editable
  - [ ] "Send to Shannon" saves feedback
- [ ] Back button returns to categories
- [ ] View Previous Feedback works

### Laughs Section
- [ ] Record laugh → saves and shows "✓ Recorded"
- [ ] Test laugh plays recorded audio
- [ ] Clear laugh works

### Other Sections
- [ ] Costs section shows Twilio pricing
- [ ] About section shows version 1.4.2
- [ ] Credits section shows Static Karma Studios

---

## ● Recording History Player
- [ ] Shows "No recordings yet" if empty
- [ ] Player controls appear when recordings exist
- [ ] Select recording → highlights it
- [ ] ▶ Play/⏸ Pause works
- [ ] Progress bar updates
- [ ] ⏮ Previous works
- [ ] ⏭ Next works
- [ ] Clear button works

---

## ❌ Removed Features (verify gone)
- [ ] NO red "!" emergency button in corner
- [ ] NO Voice Feedback card on main screen
- [ ] NO separate Feedback modal

---

## 📱 Mobile / Responsive
- [ ] NO horizontal scrolling anywhere
- [ ] Prefs menu fits on screen (centered)
- [ ] Voice grid fits on screen (vertical scroll only)
- [ ] All buttons are touch-friendly (48px minimum)
- [ ] Modals don't overflow screen
- [ ] Text is readable
- [ ] Input fields work on mobile keyboard

---

## 💾 Data Persistence
- [ ] Refresh page → all settings preserved
- [ ] Scripts persist
- [ ] Voice selection persists
- [ ] Personal info persists
- [ ] Insurances/pharmacies persist
- [ ] Audio settings persist
- [ ] Recorded laughs persist
- [ ] Feedback recordings persist

---

## 🐛 Bug Fixes Verified
- [ ] No "classList of null" errors in console
- [ ] loadVoices doesn't crash on page load
- [ ] Voice modal filter buttons work correctly

---

## ✅ Final Checks
- [ ] Console shows NO errors
- [ ] All modals open and close properly
- [ ] Footer shows "Robin's Voice v1.4.2"
- [ ] App feels responsive
- [ ] Ready for GitHub Pages deployment!

---

## 📝 Notes
_Write any bugs or issues found here:_

```
Bug 1: 
Steps to reproduce:
Expected:
Actual:

Bug 2:
Steps to reproduce:
Expected:
Actual:
```
