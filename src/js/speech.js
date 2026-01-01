// Robin's Voice v1.4.2 - Speech & Voice

// ============================================
// CURATED FEMALE VOICES BY REGION
// ============================================
const CURATED_VOICES = {
  'us-can': {
    label: '🇺🇸 US & Canada',
    voices: [
      { name: 'Rachel', accent: 'American', desc: 'Warm, conversational' },
      { name: 'Domi', accent: 'American', desc: 'Strong, confident' },
      { name: 'Bella', accent: 'American', desc: 'Soft, friendly' },
      { name: 'Elli', accent: 'American', desc: 'Young, energetic' },
      { name: 'Charlotte', accent: 'American', desc: 'Professional' },
      { name: 'Dorothy', accent: 'American', desc: 'Pleasant, clear' },
      { name: 'Sarah', accent: 'American', desc: 'Calm, reassuring' },
    ]
  },
  'western-eu': {
    label: '🇬🇧 Western EU',
    voices: [
      { name: 'Matilda', accent: 'British', desc: 'Warm, friendly' },
      { name: 'Grace', accent: 'British', desc: 'Elegant, clear' },
      { name: 'Lily', accent: 'British', desc: 'Young, bright' },
      { name: 'Freya', accent: 'British', desc: 'Professional' },
      { name: 'Nicole', accent: 'French', desc: 'Sophisticated' },
      { name: 'Gigi', accent: 'French', desc: 'Playful' },
      { name: 'Serena', accent: 'Italian', desc: 'Melodic' },
    ]
  },
  'latam': {
    label: '🌎 LATAM',
    voices: [
      { name: 'Valentina', accent: 'Spanish', desc: 'Warm, expressive' },
      { name: 'Isabella', accent: 'Spanish', desc: 'Clear, friendly' },
      { name: 'Lucia', accent: 'Spanish', desc: 'Professional' },
      { name: 'Camila', accent: 'Portuguese', desc: 'Bright, engaging' },
      { name: 'Gabriela', accent: 'Spanish', desc: 'Confident' },
    ]
  },
  'asia': {
    label: '🌏 Asia',
    voices: [
      { name: 'Yuki', accent: 'Japanese', desc: 'Gentle, clear' },
      { name: 'Mei', accent: 'Chinese', desc: 'Professional' },
      { name: 'Priya', accent: 'Indian', desc: 'Warm, articulate' },
      { name: 'Ananya', accent: 'Indian', desc: 'Friendly' },
      { name: 'Soo-Jin', accent: 'Korean', desc: 'Bright' },
    ]
  },
  'eastern-eu': {
    label: '🇵🇱 Eastern EU',
    voices: [
      { name: 'Natasha', accent: 'Russian', desc: 'Strong, clear' },
      { name: 'Anya', accent: 'Russian', desc: 'Warm' },
      { name: 'Katya', accent: 'Ukrainian', desc: 'Melodic' },
      { name: 'Marta', accent: 'Polish', desc: 'Professional' },
      { name: 'Elena', accent: 'Romanian', desc: 'Friendly' },
    ]
  }
};

// ============================================
// FUN TEST PHRASES - Cycles randomly!
// ============================================
const FIRST_TIME_PHRASE = "In a world of plain voices, be a voice with personality!";

const TEST_PHRASES = [
  // Friendly greetings
  "Hey there! Nice to meet you!",
  "Well hello! How's your day going?",
  "Hi! I'm testing my voice. Pretty cool, right?",
  
  // Playful
  "Did you know flamingos can only eat with their heads upside down?",
  "I tried to catch some fog earlier. I mist.",
  "Why don't scientists trust atoms? Because they make up everything!",
  "I'm not a regular voice assistant, I'm a cool voice assistant.",
  
  // Engaging
  "Fun fact: Honey never spoils. They found 3000 year old honey in Egyptian tombs!",
  "If you were a vegetable, you'd be a cute-cumber!",
  "Plot twist: I'm actually a very sophisticated series of ones and zeros.",
  
  // Robin-specific
  "This is Robin speaking. Well, sort of. Technology is wild!",
  "Testing, testing, one two three. Do I sound fabulous?",
  "I could talk about the weather, but let's be more interesting than that.",
  
  // Practical but fun
  "The quick brown fox jumps over the lazy dog. Classic!",
  "How now, brown cow? Just checking all my vowels work.",
  "She sells seashells by the seashore. Try saying that fast!",
  
  // Encouraging
  "You're doing great! Just checking how I sound.",
  "Every voice tells a story. What's yours?",
  "Communication is a superpower. Let's use it well!",
  
  // Quirky
  "I speak, therefore I am... a voice assistant.",
  "Beep boop! Just kidding, I'm much more sophisticated than that.",
];

let lastTestPhraseIndex = -1;

function getTestPhrase() {
  // First time ever? Use the special welcome phrase!
  if (!localStorage.getItem('robinFirstVoiceTest')) {
    localStorage.setItem('robinFirstVoiceTest', 'true');
    return FIRST_TIME_PHRASE;
  }
  
  // Otherwise, cycle through random phrases
  let index;
  do {
    index = Math.floor(Math.random() * TEST_PHRASES.length);
  } while (index === lastTestPhraseIndex && TEST_PHRASES.length > 1);
  lastTestPhraseIndex = index;
  return TEST_PHRASES[index];
}

// Legacy function name for compatibility
function getRandomTestPhrase() {
  return getTestPhrase();
}

// ============================================
// STATUS
// ============================================
function setStatus(status, text) {
  document.getElementById('statusDot').className = 'status-dot ' + status;
  document.getElementById('statusText').textContent = text;
}

// ============================================
// SPEECH
// ============================================
async function speak(text, isTest = false) {
  if (!state.apiKey || !state.selectedVoiceId) {
    alert('Add API key and select voice');
    return;
  }
  
  stopSpeaking();
  setStatus('loading', 'Speaking...');
  
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + state.selectedVoiceId, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': state.apiKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });
    
    const blob = await response.blob();
    state.currentAudio = new Audio(URL.createObjectURL(blob));
    state.currentAudio.playbackRate = state.speechSpeed;
    
    state.currentAudio.onplay = () => setStatus('speaking', 'Speaking...');
    state.currentAudio.onended = () => {
      setStatus('ready', 'Ready');
      if (isTest) {
        document.getElementById('testBtn').textContent = '🔊 Test';
        document.getElementById('testBtn').classList.remove('stop-mode');
        state.isTesting = false;
      }
    };
    
    await state.currentAudio.play();
    // Note: Call history is tracked separately via Call Session, not every phrase
    
  } catch (e) {
    setStatus('error', 'Error');
    console.error(e);
  }
}

function stopSpeaking() {
  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio = null;
  }
  setStatus('ready', 'Ready');
}

// ============================================
// SPEAK HELPERS
// ============================================
function speakCustom() {
  const text = document.getElementById('customText').value.trim();
  if (text) {
    speak(text);
    document.getElementById('customText').value = '';
  }
}

function speakIntro() {
  speak(replacePlaceholders(state.introText));
}

function speakVerify() {
  speak(replacePlaceholders(state.verifyText));
}

function speakInfo(type) {
  const primary = state.insurances.find(i => i.type === 'Medical') || state.insurances[0];
  const pharm = state.pharmacies.find(p => p.primary) || state.pharmacies[0];
  
  const phrases = {
    name: "The name is " + getFullName() + ".",
    dob: "Date of birth is " + (state.info.dob || 'not set') + ".",
    phone: "Phone is " + (state.info.phone || 'not set') + ".",
    address: "Address is " + getFullAddress() + ".",
    insurance: primary 
      ? "Insurance is " + primary.provider + ", ID " + primary.memberId + 
        (primary.group ? ", Group " + primary.group : "") + "."
      : 'Insurance not set.',
    pharmacy: pharm 
      ? "Pharmacy is " + pharm.name + (pharm.phone ? " at " + pharm.phone : "") + "."
      : 'Pharmacy not set.'
  };
  
  speak(phrases[type]);
}

// ============================================
// VOICE LOADING
// ============================================
async function loadVoices() {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': state.apiKey }
    });
    const data = await response.json();
    
    state.allVoices = data.voices.map(v => ({
      id: v.voice_id,
      name: v.name,
      gender: (v.labels?.gender || '').toLowerCase(),
      accent: (v.labels?.accent || '').toLowerCase()
    }));
    
    // Separate special voices (Robin's cloned voices)
    state.specialVoices = state.allVoices
      .filter(v => v.name.toLowerCase().includes('robin'))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    state.allVoices = state.allVoices
      .filter(v => !v.name.toLowerCase().includes('robin'))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    // Only render if voice modal is open
    if (document.getElementById('voiceModal')?.classList.contains('active')) {
      renderSpecialVoices();
      const firstBtn = document.querySelector('.filter-btn');
      if (firstBtn) filterByRegion('robin', firstBtn);
    }
    
  } catch (e) {
    console.error('Error loading voices:', e);
  }
}

function renderSpecialVoices() {
  const container = document.getElementById('specialVoices');
  if (!container) return;
  
  if (!state.specialVoices.length) {
    container.innerHTML = '<div class="loading-msg">No custom voices</div>';
    return;
  }
  
  container.innerHTML = state.specialVoices.map(v => 
    `<div class="special-voice ${v.id === state.selectedVoiceId ? 'selected' : ''}" 
          onclick="selectVoice('${v.id}')">
      <div class="voice-name">⭐ ${v.name}</div>
      <div class="voice-meta">Custom</div>
    </div>`
  ).join('');
  
  // Auto-select first special voice if none selected
  if (!state.selectedVoiceId && state.specialVoices.length) {
    selectVoice(state.specialVoices[0].id);
  }
}

// Legacy function - now using filterByRegion
function filterVoices(filter, btn) {
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  if (filter === 'all') {
    state.filteredVoices = state.allVoices;
  } else if (filter === 'female' || filter === 'male') {
    state.filteredVoices = state.allVoices.filter(v => v.gender === filter);
  } else {
    state.filteredVoices = state.allVoices.filter(v => v.accent.includes(filter));
  }
  
  renderVoices();
}

function renderVoices() {
  const grid = document.getElementById('voiceGrid');
  const countEl = document.getElementById('voiceCount');
  
  // Guard against null elements when modal not open
  if (!grid || !countEl) return;
  
  countEl.textContent = (state.filteredVoices?.length || 0) + ' voices';
  
  grid.innerHTML = state.filteredVoices?.length 
    ? state.filteredVoices.map(v => 
        `<div class="voice-card ${v.id === state.selectedVoiceId ? 'selected' : ''}" 
              onclick="selectVoice('${v.id}')">
          <div class="voice-name">${v.name}</div>
          <div class="voice-meta">${v.accent || v.gender || ''}</div>
        </div>`
      ).join('')
    : '<div class="loading-msg">None</div>';
}

function selectVoice(id) {
  state.selectedVoiceId = id;
  localStorage.setItem('robinVoiceId', id);
  
  document.querySelectorAll('.voice-card, .special-voice').forEach(c => {
    c.classList.toggle('selected', c.onclick?.toString().includes(id));
  });
  
  document.getElementById('testBtn').disabled = false;
}

function toggleTest() {
  if (state.isTesting) {
    stopSpeaking();
    document.getElementById('testBtn').textContent = '▶ Test Voice';
    document.getElementById('testBtn').classList.remove('stop-mode');
    state.isTesting = false;
  } else {
    state.isTesting = true;
    document.getElementById('testBtn').textContent = '■ Stop';
    document.getElementById('testBtn').classList.add('stop-mode');
    speak(getTestPhrase(), true);
  }
}

// ============================================
// REGIONAL VOICE FILTERING
// ============================================
let currentRegion = 'robin';

function filterByRegion(region, btn) {
  currentRegion = region;
  
  // Update button styling
  document.querySelectorAll('.filter-btn').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  
  // Clear special voices area if not robin
  const specialDiv = document.getElementById('specialVoices');
  const gridDiv = document.getElementById('voiceGrid');
  
  if (region === 'robin') {
    // Show Robin's custom voices only
    renderSpecialVoices();
    gridDiv.innerHTML = '';
    document.getElementById('voiceCount').textContent = state.specialVoices.length + ' custom voices';
    return;
  }
  
  // Hide special voices section for other regions
  specialDiv.innerHTML = '';
  
  // Filter voices
  if (region === 'all') {
    state.filteredVoices = state.allVoices.filter(v => v.gender === 'female');
  } else {
    const regionVoiceNames = CURATED_VOICES[region]?.voices.map(v => v.name.toLowerCase()) || [];
    state.filteredVoices = state.allVoices.filter(v => 
      regionVoiceNames.includes(v.name.toLowerCase()) ||
      (CURATED_VOICES[region]?.voices.some(cv => 
        v.accent.includes(cv.accent.toLowerCase())
      ) && v.gender === 'female')
    );
  }
  
  renderVoices();
}

function renderVoicesWithCuration() {
  const grid = document.getElementById('voiceGrid');
  const countEl = document.getElementById('voiceCount');
  
  if (currentRegion === 'all' || currentRegion === 'robin') {
    // Standard rendering
    renderVoices();
    return;
  }
  
  // Render with curated info
  const regionData = CURATED_VOICES[currentRegion];
  if (!regionData) {
    renderVoices();
    return;
  }
  
  const curatedNames = regionData.voices.map(v => v.name.toLowerCase());
  const matchedVoices = state.allVoices.filter(v => 
    curatedNames.includes(v.name.toLowerCase()) && v.gender === 'female'
  );
  
  countEl.textContent = matchedVoices.length + ' voices • ' + regionData.label;
  
  if (matchedVoices.length === 0) {
    grid.innerHTML = `
      <div class="loading-msg" style="grid-column: span 3;">
        Loading ${regionData.label} voices...<br>
        <small>Some regional voices may need ElevenLabs subscription</small>
      </div>`;
    return;
  }
  
  grid.innerHTML = matchedVoices.map(v => {
    const curated = regionData.voices.find(cv => cv.name.toLowerCase() === v.name.toLowerCase());
    return `
      <div class="voice-card ${v.id === state.selectedVoiceId ? 'selected' : ''}" 
           onclick="selectVoice('${v.id}')" title="${curated?.desc || v.accent}">
        <div class="voice-name">${v.name}</div>
        <div class="voice-meta">${curated?.accent || v.accent}</div>
      </div>`;
  }).join('');
}
