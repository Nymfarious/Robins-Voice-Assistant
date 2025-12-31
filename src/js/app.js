// Robin's Voice v1.0.1 - Voice Assistant
// App State & Initialization

// ============================================
// EMBEDDED API KEYS - Robin's personal keys
// ============================================
const ROBIN_ELEVENLABS_KEY = 'sk_0d7f63b1b650bfad8872e15532508b0e7c54877bafd24086';

// Twilio (for future phone integration)
const TWILIO_CONFIG = {
  accountSid: 'fb2007b25ded0005fcbcc00c985911ed61779a315bd7a2d10132811ab8f1f531',
  authToken: '75e0173b3ab6a207058f115833f8e52d16e55607881592867f4e031cc71ee9c3',
  testSid: '11fad3577f4a082a373553ccd1a4b0ef183021884b495c34a9588f14cde8c245',
  testAuthToken: '56655e6d3f1248f8ed59c8d73ce949e4c6ce651c6c3af4c369078bbab79eb46f'
};

// ============================================
// STATE
// ============================================
const state = {
  // API Keys - Robin's key pre-loaded!
  apiKey: ROBIN_ELEVENLABS_KEY,
  claudeKey: localStorage.getItem('robinClaudeKey') || '',
  
  // Voice
  allVoices: [],
  filteredVoices: [],
  specialVoices: [],
  selectedVoiceId: localStorage.getItem('robinVoiceId') || '',
  speechSpeed: parseFloat(localStorage.getItem('robinSpeed') || '0.95'),
  currentAudio: null,
  isTesting: false,
  
  // User Info
  info: JSON.parse(localStorage.getItem('robinInfo') || '{}'),
  insurances: JSON.parse(localStorage.getItem('robinInsurances') || '[]'),
  pharmacies: JSON.parse(localStorage.getItem('robinPharmacies') || '[]'),
  
  // History & Scripts
  history: JSON.parse(localStorage.getItem('robinHistory') || '[]'),
  myScripts: JSON.parse(localStorage.getItem('robinScripts') || '[]'),
  fullScripts: JSON.parse(localStorage.getItem('robinFullScripts') || JSON.stringify({
    doctor: [{id: 1, name: 'Schedule Appointment', text: "Hi, this is Robin. I'm calling to schedule an appointment. My date of birth is [DOB]."}],
    pharmacy: [{id: 2, name: 'Refill Rx', text: "Hi, this is Robin. I need to refill a prescription. My date of birth is [DOB]."}],
    transport: [{id: 3, name: 'Schedule Ride', text: "Hi, this is Robin. I need to schedule a ride. Pickup at [ADDRESS]."}],
    insurance: [{id: 4, name: 'Coverage Question', text: "Hi, this is Robin. I have a question about my coverage. My member ID is [INSURANCE]."}],
    custom: []
  })),
  currentCat: 'doctor',
  
  // UI State
  selectedIcon: '⭐',
  editingBtn: '',
  
  // Custom Button Text - Robin's defaults
  introText: localStorage.getItem('robinIntroText') || "Hi, this is Robin. I can hear you but I use this voice assistant to communicate. How can I help you?",
  introLabel: localStorage.getItem('robinIntroLabel') || '"Hi, this is Robin..."',
  verifyText: localStorage.getItem('robinVerifyText') || "Let me verify that. One moment please.",
  verifyLabel: localStorage.getItem('robinVerifyLabel') || '"Let me verify..."'
};

// ============================================
// LAUGH EXPRESSIONS
// ============================================
// Placeholder for laugh audio clips
// These would be pre-recorded clips of Robin's laugh
const laughSounds = {
  chuckle: null,  // Light chuckle audio
  laugh: null,    // Full laugh audio
  giggle: null    // Amused giggle audio
};

function playLaugh(type) {
  // For now, use TTS to approximate a laugh
  // Later: Replace with actual recorded clips of Robin's laugh
  const laughPhrases = {
    chuckle: "Ha ha.",
    laugh: "Ha ha ha ha!",
    giggle: "Hee hee."
  };
  
  const phrase = laughPhrases[type] || laughPhrases.chuckle;
  
  // Check if we have a recorded audio clip
  if (laughSounds[type]) {
    laughSounds[type].play();
  } else {
    // Fall back to TTS
    speak(phrase, false);
  }
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
  // Clear the "Type Anything" input field on load
  const customTextInput = document.getElementById('customText');
  if (customTextInput) {
    customTextInput.value = '';
  }
  
  loadInfoFields();
  updateHeaderName();
  updateBtnLabels();
  
  // API Key Status - Robin's key is pre-loaded!
  if (state.apiKey) {
    document.getElementById('apiKey').value = '••••••••••••';
    document.getElementById('keyStatus').textContent = '✓ Robin\'s Key Active';
    document.getElementById('keyStatus').className = 'key-status saved';
    loadVoices();
  }
  
  if (state.claudeKey) {
    document.getElementById('claudeKey').value = '••••••';
    document.getElementById('claudeStatus').textContent = '✓ Saved';
    document.getElementById('claudeStatus').className = 'key-status saved';
  }
  
  // Speed Slider
  document.getElementById('speedSlider').value = state.speechSpeed;
  document.getElementById('speedValue').textContent = state.speechSpeed.toFixed(2) + 'x';
  document.getElementById('speedSlider').addEventListener('input', (e) => {
    state.speechSpeed = parseFloat(e.target.value);
    document.getElementById('speedValue').textContent = state.speechSpeed.toFixed(2) + 'x';
    localStorage.setItem('robinSpeed', state.speechSpeed);
  });
  
  // Enter key for custom text
  document.getElementById('customText').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') speakCustom();
  });
  
  // Hotkey buttons
  document.querySelectorAll('.hotkey-btn[data-msg]').forEach(b => {
    b.addEventListener('click', () => speak(b.dataset.msg));
  });
  
  document.querySelectorAll('.hotkey-btn[data-info]').forEach(b => {
    b.addEventListener('click', () => speakInfo(b.dataset.info));
  });
  
  // Render UI
  renderMyScripts();
  renderHistory();
  renderInsurances();
  renderPharmacies();
  renderQuickScripts();
}

// Run on load
window.addEventListener('load', init);
