// Robin's Voice v1.4.2 - Voice Assistant
// App State & Initialization

// ============================================
// EMBEDDED API KEYS - Robin's personal keys
// ============================================
const ROBIN_ELEVENLABS_KEY = 'sk_0d7f63b1b650bfad8872e15532508b0e7c54877bafd24086';

// Twilio loaded from localStorage (enter via Info → API tab)
const TWILIO_CONFIG = {
  accountSid: localStorage.getItem('robinTwilioSid') || '',
  authToken: localStorage.getItem('robinTwilioToken') || '',
  testSid: localStorage.getItem('robinTwilioTestSid') || '',
  testAuthToken: localStorage.getItem('robinTwilioTestToken') || ''
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
  
  // Recording State
  lastRecordedAudio: null,
  autoSummarize: localStorage.getItem('robinAutoSummarize') === 'true',
  
  // Smart Features State
  smartSettings: JSON.parse(localStorage.getItem('robinSmartSettings') || JSON.stringify({
    transcribe: false,
    showTranscript: true,
    autoRecord: false,
    autoRecordTriggers: ['doctors', 'pharmacy'],
    autoSummarize: true,
    extractKeyInfo: true
  })),
  
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
// LAUGH SOUNDS
// ============================================
// Audio clips for laugh buttons - can be loaded from uploads or IndexedDB
const laughSounds = {
  chuckle: null,  // Light chuckle audio
  laugh: null,    // Full hearty laugh
  sarcastic: null // Dry "ha ha" audio
};

function playLaugh(type) {
  // Check if we have a recorded audio clip
  if (laughSounds[type] && laughSounds[type] instanceof Blob) {
    const audio = new Audio(URL.createObjectURL(laughSounds[type]));
    audio.volume = getAudioVolume();
    audio.play();
    return;
  }
  
  // Fall back to TTS with laugh phrases
  const laughPhrases = {
    chuckle: "Heh heh heh.",
    laugh: "Ha ha ha ha!",
    sarcastic: "Ha. Ha. Ha."
  };
  
  speak(laughPhrases[type] || laughPhrases.chuckle, false);
}

// Load laugh audio from localStorage
function loadLaughSounds() {
  ['chuckle', 'laugh', 'sarcastic'].forEach(type => {
    const stored = localStorage.getItem('robinLaugh_' + type);
    if (stored) {
      try {
        const binary = atob(stored);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        laughSounds[type] = new Blob([array], { type: 'audio/webm' });
      } catch (e) {
        console.log('Error loading laugh sound:', type, e);
      }
    }
  });
}

// Save laugh audio to localStorage
function saveLaughSound(type, blob) {
  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result.split(',')[1];
    localStorage.setItem('robinLaugh_' + type, base64);
    laughSounds[type] = blob;
  };
  reader.readAsDataURL(blob);
}

// Get audio volume from settings
function getAudioVolume() {
  const settings = JSON.parse(localStorage.getItem('robinAudioSettings') || '{}');
  const vol = (settings.speakerVolume || 80) / 100;
  const boost = settings.boostVolume ? 1.2 : 1;
  return Math.min(1, vol * boost);
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
  loadLaughSounds();
  
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
