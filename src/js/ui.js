// Robin's Voice v1.4.2 - UI Functions

// ============================================
// THEME TOGGLE
// ============================================
function toggleTheme() {
  const body = document.body;
  const toggle = document.getElementById('themeToggle');
  
  body.classList.toggle('light-theme');
  
  const isLight = body.classList.contains('light-theme');
  toggle.textContent = isLight ? '🌙' : '☀️';
  
  // Save preference
  localStorage.setItem('robinTheme', isLight ? 'light' : 'dark');
}

function loadTheme() {
  const saved = localStorage.getItem('robinTheme');
  const toggle = document.getElementById('themeToggle');
  
  if (saved === 'light') {
    document.body.classList.add('light-theme');
    if (toggle) toggle.textContent = '🌙';
  } else {
    if (toggle) toggle.textContent = '☀️';
  }
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', loadTheme);

// ============================================
// COLLAPSE
// ============================================
function toggleCollapse(id) {
  const content = document.getElementById(id + '-content');
  const header = content.previousElementSibling;
  content.classList.toggle('collapsed');
  header.classList.toggle('collapsed');
}

// ============================================
// TABS
// ============================================
function showTab(tab, btn) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
  // Deselect all tabs
  document.querySelectorAll('.phrase-tab').forEach(x => x.classList.remove('active'));
  // Show selected tab
  document.getElementById('tab-' + tab).classList.add('active');
  btn.classList.add('active');
}

// ============================================
// PREFS MENU
// ============================================
function openPrefsMenu() {
  document.getElementById('prefsMenu').classList.add('active');
  document.getElementById('prefsOverlay').classList.add('active');
}

function closePrefsMenu() {
  document.getElementById('prefsMenu').classList.remove('active');
  document.getElementById('prefsOverlay').classList.remove('active');
}

// ============================================
// BASIC INFO MODAL
// ============================================
function openBasicInfoModal() {
  closePrefsMenu();
  document.getElementById('basicInfoModal').classList.add('active');
  loadBasicInfoFields();
}

function closeBasicInfoModal() {
  document.getElementById('basicInfoModal').classList.remove('active');
}

function loadBasicInfoFields() {
  document.getElementById('firstName').value = state.info.firstName || '';
  document.getElementById('lastName').value = state.info.lastName || '';
  document.getElementById('nickname').value = state.info.nickname || '';
  document.getElementById('pronounceFirst').value = state.info.pronounceFirst || '';
  document.getElementById('pronounceLast').value = state.info.pronounceLast || '';
}

function saveBasicInfo() {
  state.info.firstName = document.getElementById('firstName').value.trim();
  state.info.lastName = document.getElementById('lastName').value.trim();
  state.info.nickname = document.getElementById('nickname').value.trim();
  state.info.pronounceFirst = document.getElementById('pronounceFirst').value.trim();
  state.info.pronounceLast = document.getElementById('pronounceLast').value.trim();
  localStorage.setItem('robinInfo', JSON.stringify(state.info));
  updateHeaderName();
  closeBasicInfoModal();
  showStatus('Saved!');
}

function testPronounce(type) {
  const field = type === 'first' ? 'pronounceFirst' : 'pronounceLast';
  const text = document.getElementById(field).value.trim();
  if (text) {
    speak(text, false);
  }
}

// ============================================
// PII MODAL
// ============================================
function openPIIModal() {
  closePrefsMenu();
  document.getElementById('piiModal').classList.add('active');
  loadPIIFields();
}

function closePIIModal() {
  document.getElementById('piiModal').classList.remove('active');
}

function loadPIIFields() {
  document.getElementById('dob').value = state.info.dob || '';
  document.getElementById('phone').value = state.info.phone || '';
  document.getElementById('address1').value = state.info.address1 || '';
  document.getElementById('address2').value = state.info.address2 || '';
  document.getElementById('city').value = state.info.city || '';
  document.getElementById('state').value = state.info.state || '';
  document.getElementById('zip').value = state.info.zip || '';
}

function savePII() {
  state.info.dob = document.getElementById('dob').value.trim();
  state.info.phone = document.getElementById('phone').value.trim();
  state.info.address1 = document.getElementById('address1').value.trim();
  state.info.address2 = document.getElementById('address2').value.trim();
  state.info.city = document.getElementById('city').value.trim();
  state.info.state = document.getElementById('state').value.trim();
  state.info.zip = document.getElementById('zip').value.trim();
  localStorage.setItem('robinInfo', JSON.stringify(state.info));
  closePIIModal();
  showStatus('Saved!');
}

// ============================================
// INSURANCE MODAL
// ============================================
function openInsuranceModal() {
  closePrefsMenu();
  document.getElementById('insuranceModal').classList.add('active');
  renderInsurances();
}

function closeInsuranceModal() {
  document.getElementById('insuranceModal').classList.remove('active');
}

// ============================================
// PHARMACY MODAL
// ============================================
function openPharmacyModal() {
  closePrefsMenu();
  document.getElementById('pharmacyModal').classList.add('active');
  renderPharmacies();
}

function closePharmacyModal() {
  document.getElementById('pharmacyModal').classList.remove('active');
}

// ============================================
// API MODAL
// ============================================
function openAPIModal() {
  closePrefsMenu();
  document.getElementById('apiModal').classList.add('active');
  
  // Show status
  if (state.apiKey) {
    document.getElementById('apiKey').value = '••••••••••••';
    document.getElementById('keyStatus').textContent = '✓ Active';
    document.getElementById('keyStatus').className = 'key-status saved';
  }
  if (state.claudeKey) {
    document.getElementById('claudeKey').value = '••••••••••••';
    document.getElementById('claudeStatus').textContent = '✓ Saved';
    document.getElementById('claudeStatus').className = 'key-status saved';
  }
  if (localStorage.getItem('robinTwilioSid')) {
    document.getElementById('twilioSid').value = '••••••••';
    document.getElementById('twilioToken').value = '••••••••';
    document.getElementById('twilioStatus').textContent = '✓ Saved';
    document.getElementById('twilioStatus').className = 'key-status saved';
  }
}

function closeAPIModal() {
  document.getElementById('apiModal').classList.remove('active');
}

// ============================================
// SCRIPTS LIBRARY MODAL
// ============================================
function openScriptsLibraryModal() {
  closePrefsMenu();
  document.getElementById('scriptsLibraryModal').classList.add('active');
  renderFullScripts();
}

function closeScriptsLibraryModal() {
  document.getElementById('scriptsLibraryModal').classList.remove('active');
}

// ============================================
// VOICE MODAL
// ============================================
function openVoiceModal() {
  closePrefsMenu();
  document.getElementById('voiceModal').classList.add('active');
  
  // Load voices if not already loaded
  if (state.apiKey && !state.allVoices.length) {
    loadVoices();
  }
  
  // Default to Robin's voices tab
  const robinTab = document.querySelector('.region-tab');
  if (robinTab) {
    filterByRegion('robin', robinTab);
  }
}

function closeVoiceModal() {
  document.getElementById('voiceModal').classList.remove('active');
}

// ============================================
// FEEDBACK SYSTEM (in Help & About)
// ============================================
let selectedFeedbackCategory = null;
let feedbackRecorder = null;
let feedbackChunks = [];
let feedbackRecording = false;
let feedbackTimer = null;
let feedbackStartTime = null;
let feedbackAudioBlob = null;
let feedbackAudioUrl = null;

function selectFeedbackCategory(category) {
  selectedFeedbackCategory = category;
  
  // Update UI
  document.querySelectorAll('.feedback-cat-btn').forEach(btn => btn.classList.remove('selected'));
  event.target.closest('.feedback-cat-btn')?.classList.add('selected');
  
  // Show recorder
  document.getElementById('feedbackCategories').style.display = 'none';
  document.getElementById('feedbackRecorderSection').style.display = 'block';
  
  // Set category label
  const labels = {
    sync: '↻ Sync Request',
    ui: '◐ UI Suggestion', 
    bug: '🐛 Report a Bug',
    idea: '◆ New Idea',
    urgent: '! Urgent Issue',
    general: '◯ Just Talking'
  };
  document.getElementById('feedbackCatLabel').textContent = labels[category] || 'Feedback';
  
  // Reset recorder state
  resetFeedbackRecording();
}

function backToCategories() {
  document.getElementById('feedbackCategories').style.display = 'block';
  document.getElementById('feedbackRecorderSection').style.display = 'none';
  document.getElementById('feedbackPreview').style.display = 'none';
  resetFeedbackRecording();
}

async function toggleFeedbackRecord() {
  if (feedbackRecording) {
    stopFeedbackRecording();
  } else {
    await startFeedbackRecording();
  }
}

async function startFeedbackRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    feedbackRecorder = new MediaRecorder(stream);
    feedbackChunks = [];
    feedbackRecording = true;
    feedbackStartTime = Date.now();
    
    feedbackRecorder.ondataavailable = (e) => {
      feedbackChunks.push(e.data);
    };
    
    feedbackRecorder.onstop = () => {
      feedbackAudioBlob = new Blob(feedbackChunks, { type: 'audio/webm' });
      feedbackAudioUrl = URL.createObjectURL(feedbackAudioBlob);
      stream.getTracks().forEach(track => track.stop());
      
      // Show preview section
      showFeedbackPreview();
    };
    
    feedbackRecorder.start();
    
    // Update UI
    document.getElementById('feedbackRecordBtn').classList.add('recording');
    document.getElementById('feedbackRecordIcon').textContent = '■';
    document.getElementById('feedbackRecordHint').textContent = 'Tap to stop recording';
    
    // Start timer
    feedbackTimer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - feedbackStartTime) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      document.getElementById('feedbackTimer').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
    
  } catch (err) {
    console.error('Mic error:', err);
    alert('Could not access microphone. Please allow microphone access.');
  }
}

function stopFeedbackRecording() {
  if (feedbackRecorder && feedbackRecorder.state !== 'inactive') {
    feedbackRecorder.stop();
  }
  feedbackRecording = false;
  
  if (feedbackTimer) {
    clearInterval(feedbackTimer);
    feedbackTimer = null;
  }
  
  // Update UI
  document.getElementById('feedbackRecordBtn').classList.remove('recording');
  document.getElementById('feedbackRecordIcon').textContent = '●';
  document.getElementById('feedbackRecordHint').textContent = 'Tap to start recording';
}

function resetFeedbackRecording() {
  stopFeedbackRecording();
  document.getElementById('feedbackTimer').textContent = '0:00';
  document.getElementById('feedbackPreview').style.display = 'none';
  feedbackChunks = [];
  feedbackAudioBlob = null;
  feedbackAudioUrl = null;
}

function showFeedbackPreview() {
  const elapsed = Math.floor((Date.now() - feedbackStartTime) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  
  document.getElementById('feedbackPreview').style.display = 'block';
  document.getElementById('previewDuration').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  document.getElementById('feedbackTranscript').value = '';
  document.getElementById('feedbackTranscript').placeholder = 'Optional: Type what you said or edit the transcription...';
}

function playFeedbackPreview() {
  if (feedbackAudioUrl) {
    const audio = new Audio(feedbackAudioUrl);
    audio.play();
  }
}

function reRecordFeedback() {
  document.getElementById('feedbackPreview').style.display = 'none';
  resetFeedbackRecording();
}

function sendFeedbackToShannon() {
  if (!feedbackAudioBlob) {
    alert('Please record your feedback first');
    return;
  }
  
  // Convert to base64 and save
  const reader = new FileReader();
  reader.onload = () => {
    const feedback = {
      id: Date.now(),
      type: selectedFeedbackCategory,
      timestamp: new Date().toISOString(),
      audio: reader.result,
      transcription: document.getElementById('feedbackTranscript').value.trim(),
      status: 'pending'
    };
    
    const allFeedback = JSON.parse(localStorage.getItem('robinFeedback') || '[]');
    allFeedback.unshift(feedback);
    if (allFeedback.length > 20) allFeedback.pop();
    localStorage.setItem('robinFeedback', JSON.stringify(allFeedback));
    
    // Also save to recordings player
    const elapsed = Math.floor((Date.now() - feedbackStartTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    saveRecording(
      `Feedback: ${selectedFeedbackCategory}`,
      reader.result,
      `${mins}:${secs.toString().padStart(2, '0')}`
    );
    
    // Reset and go back
    backToCategories();
    showAboutSection('quickstart');
    alert('✓ Feedback sent to Shannon!');
  };
  reader.readAsDataURL(feedbackAudioBlob);
}

function showFeedbackHistory() {
  const feedback = JSON.parse(localStorage.getItem('robinFeedback') || '[]');
  
  if (feedback.length === 0) {
    alert('No previous feedback recorded');
    return;
  }
  
  let content = 'Previous Feedback:\n\n';
  feedback.slice(0, 10).forEach((f, i) => {
    const date = new Date(f.timestamp).toLocaleDateString();
    content += `${i + 1}. ${f.type.toUpperCase()} - ${date}\n`;
    if (f.transcription) content += `   "${f.transcription}"\n`;
    content += '\n';
  });
  
  alert(content);
}

// Legacy function for old feedback modal (if still referenced)
function openFeedbackModal() {
  openAboutModal();
  setTimeout(() => showAboutSection('feedback'), 100);
}

function closeFeedbackModal() {
  closeAboutModal();
}

function viewPreviousFeedback() {
  const allFeedback = JSON.parse(localStorage.getItem('robinFeedback') || '[]');
  
  if (allFeedback.length === 0) {
    alert('No previous feedback recorded.');
    return;
  }
  
  // Create simple list view
  const chat = document.getElementById('helperChat');
  if (!chat) return;
  
  let html = '<div class="helper-message assistant">Your previous feedback:</div>';
  allFeedback.slice(0, 5).forEach((f, i) => {
    const date = new Date(f.timestamp).toLocaleDateString();
    const typeLabels = { sync: '↻ Sync', ui: '◐ UI', bug: '✕ Bug', idea: '◆ Idea', general: '◯ General' };
    html += `
      <div class="helper-message user" style="cursor:pointer;" onclick="playFeedbackAudio(${i})">
        ${typeLabels[f.type] || f.type} - ${date}
        <br><small>▶ Tap to play</small>
      </div>
    `;
  });
  
  chat.innerHTML = html;
  showAboutSection('helper');
}

function playFeedbackAudio(index) {
  const allFeedback = JSON.parse(localStorage.getItem('robinFeedback') || '[]');
  if (allFeedback[index] && allFeedback[index].audio) {
    const audio = new Audio(allFeedback[index].audio);
    audio.play();
  }
}

// ============================================
// MY SCRIPT MODAL
// ============================================
function openMyScriptModal() {
  document.getElementById('myScriptModal').classList.add('active');
  document.getElementById('myScriptName').value = '';
  document.getElementById('myScriptText').value = '';
  state.selectedIcon = '⭐';
  document.querySelectorAll('#iconPicker .icon-option').forEach(i => {
    i.classList.toggle('selected', i.dataset.icon === '⭐');
  });
}

function closeMyScriptModal() {
  document.getElementById('myScriptModal').classList.remove('active');
}

// ============================================
// ADD INSURANCE MODAL
// ============================================
function openAddInsuranceModal() {
  document.getElementById('addInsuranceModal').classList.add('active');
}

function closeAddInsuranceModal() {
  document.getElementById('addInsuranceModal').classList.remove('active');
}

// ============================================
// ADD PHARMACY MODAL
// ============================================
function openAddPharmacyModal() {
  document.getElementById('addPharmacyModal').classList.add('active');
}

function closeAddPharmacyModal() {
  document.getElementById('addPharmacyModal').classList.remove('active');
}

// ============================================
// EDIT BUTTON MODAL
// ============================================
function editIntroBtn() {
  state.editingBtn = 'intro';
  document.getElementById('editBtnTitle').textContent = 'Edit Intro';
  document.getElementById('editBtnLabel').value = state.introLabel;
  document.getElementById('editBtnText').value = state.introText;
  document.getElementById('editBtnModal').classList.add('active');
}

function editVerifyBtn() {
  state.editingBtn = 'verify';
  document.getElementById('editBtnTitle').textContent = 'Edit Verify';
  document.getElementById('editBtnLabel').value = state.verifyLabel;
  document.getElementById('editBtnText').value = state.verifyText;
  document.getElementById('editBtnModal').classList.add('active');
}

function closeEditBtnModal() {
  document.getElementById('editBtnModal').classList.remove('active');
}

function saveEditBtn() {
  const label = document.getElementById('editBtnLabel').value.trim();
  const text = document.getElementById('editBtnText').value.trim();
  
  if (!label || !text) {
    alert('Fill both fields');
    return;
  }
  
  if (state.editingBtn === 'intro') {
    state.introLabel = label;
    state.introText = text;
    localStorage.setItem('robinIntroLabel', label);
    localStorage.setItem('robinIntroText', text);
  } else {
    state.verifyLabel = label;
    state.verifyText = text;
    localStorage.setItem('robinVerifyLabel', label);
    localStorage.setItem('robinVerifyText', text);
  }
  
  updateBtnLabels();
  closeEditBtnModal();
}

// ============================================
// ICON PICKER
// ============================================
function selectIcon(el) {
  document.querySelectorAll('#iconPicker .icon-option').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedIcon = el.dataset.icon;
}

// ============================================
// TOGGLE SETTINGS
// ============================================
function toggleSetting(setting) {
  const id = 'toggle' + setting.charAt(0).toUpperCase() + setting.slice(1);
  const el = document.getElementById(id);
  if (el) el.classList.toggle('active');
}

// ============================================
// HELPER
// ============================================
function showStatus(msg) {
  document.getElementById('statusText').textContent = msg;
  setTimeout(() => {
    document.getElementById('statusText').textContent = 'Ready';
  }, 2000);
}

// Legacy support
function openInfoModal() { openBasicInfoModal(); }
function closeInfoModal() { closeBasicInfoModal(); }
function openFullScriptsModal() { openScriptsLibraryModal(); }
function closeFullScriptsModal() { closeScriptsLibraryModal(); }
function openAgentsModal() { openSmartModal(); }
function closeAgentsModal() { closeSmartModal(); }

// ============================================
// AUDIO SETTINGS MODAL
// ============================================
function openAudioModal() {
  closePrefsMenu();
  document.getElementById('audioModal').classList.add('active');
  loadAudioSettings();
}

function closeAudioModal() {
  document.getElementById('audioModal').classList.remove('active');
  stopMicTest();
}

function loadAudioSettings() {
  const settings = JSON.parse(localStorage.getItem('robinAudioSettings') || '{}');
  document.getElementById('speakerVolume').value = settings.speakerVolume || 80;
  document.getElementById('micSensitivity').value = settings.micSensitivity || 60;
  document.getElementById('boostVolume').checked = settings.boostVolume !== false;
  document.getElementById('reduceEcho').checked = settings.reduceEcho !== false;
  updateSpeakerVolume(settings.speakerVolume || 80);
  updateMicSensitivity(settings.micSensitivity || 60);
}

function updateSpeakerVolume(val) {
  document.getElementById('speakerValue').textContent = val + '%';
  saveAudioSettings();
}

function updateMicSensitivity(val) {
  document.getElementById('micValue').textContent = val + '%';
  saveAudioSettings();
}

function saveAudioSettings() {
  const settings = {
    speakerVolume: parseInt(document.getElementById('speakerVolume').value),
    micSensitivity: parseInt(document.getElementById('micSensitivity').value),
    boostVolume: document.getElementById('boostVolume').checked,
    reduceEcho: document.getElementById('reduceEcho').checked
  };
  localStorage.setItem('robinAudioSettings', JSON.stringify(settings));
}

function testSpeaker() {
  const vol = parseInt(document.getElementById('speakerVolume').value) / 100;
  const boost = document.getElementById('boostVolume').checked ? 1.3 : 1;
  speak('Testing speaker volume. Can you hear me clearly?', false, vol * boost);
}

let micStream = null;
let micAnalyser = null;
let micAnimationFrame = null;

function testMic() {
  const container = document.getElementById('micLevelContainer');
  if (container.style.display === 'none') {
    startMicTest();
  } else {
    stopMicTest();
  }
}

async function startMicTest() {
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(micStream);
    micAnalyser = audioContext.createAnalyser();
    micAnalyser.fftSize = 256;
    source.connect(micAnalyser);
    
    document.getElementById('micLevelContainer').style.display = 'block';
    updateMicLevel();
  } catch (err) {
    alert('Could not access microphone. Please allow microphone access.');
  }
}

function updateMicLevel() {
  if (!micAnalyser) return;
  
  const dataArray = new Uint8Array(micAnalyser.frequencyBinCount);
  micAnalyser.getByteFrequencyData(dataArray);
  
  const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
  const percent = Math.min(100, (average / 128) * 100);
  
  document.getElementById('micLevelFill').style.width = percent + '%';
  micAnimationFrame = requestAnimationFrame(updateMicLevel);
}

function stopMicTest() {
  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
    micStream = null;
  }
  if (micAnimationFrame) {
    cancelAnimationFrame(micAnimationFrame);
    micAnimationFrame = null;
  }
  micAnalyser = null;
  document.getElementById('micLevelContainer').style.display = 'none';
}

// ============================================
// ABOUT & HELP MODAL
// ============================================
function openAboutModal() {
  closePrefsMenu();
  document.getElementById('aboutModal').classList.add('active');
  showAboutSection('quickstart');
}

function closeAboutModal() {
  document.getElementById('aboutModal').classList.remove('active');
}

function showAboutSection(section) {
  // Hide all sections
  document.querySelectorAll('.about-section').forEach(el => el.style.display = 'none');
  // Show selected
  const el = document.getElementById('about-' + section);
  if (el) el.style.display = 'block';
}

function startWalkthrough(topic) {
  closeAboutModal();
  // TODO: Implement interactive walkthrough
  const walkthroughs = {
    'making-call': 'Walkthrough: Making a call - coming soon!',
    'receiving-call': 'Walkthrough: Receiving a call - coming soon!',
    'custom-scripts': 'Walkthrough: Custom scripts - coming soon!',
    'recording': 'Walkthrough: Recording - coming soon!',
    'pii': 'Walkthrough: Adding personal info - coming soon!'
  };
  alert(walkthroughs[topic] || 'Walkthrough coming soon!');
}

// ============================================
// ROBIN'S HELPER (AI Assistant)
// ============================================
const helperKnowledge = {
  'make a call': 'To make a call: 1) Put your phone on speaker, 2) Dial the number normally, 3) When connected, tap phrases in this app to speak. The caller will hear Robin\'s voice!',
  'how do i make a call': 'To make a call: 1) Put your phone on speaker, 2) Dial the number normally, 3) When connected, tap phrases in this app to speak. The caller will hear Robin\'s voice!',
  'custom phrase': 'To add a custom phrase: 1) Tap the "+ New" button in My Scripts, 2) Pick an icon, 3) Enter a short label and the full text, 4) Save! Your phrase appears as a quick button.',
  'add custom phrase': 'To add a custom phrase: 1) Tap the "+ New" button in My Scripts, 2) Pick an icon, 3) Enter a short label and the full text, 4) Save! Your phrase appears as a quick button.',
  'laugh buttons': 'The laugh buttons (Chuckle, Laugh, Sarcastic) play natural-sounding laughs during calls. Tap them when you want to respond with laughter instead of words!',
  'what are the laugh buttons': 'The laugh buttons (Chuckle, Laugh, Sarcastic) play natural-sounding laughs during calls. Tap them when you want to respond with laughter instead of words!',
  'laugh': 'The laugh buttons (Chuckle, Laugh, Sarcastic) play natural-sounding laughs during calls. Tap them when you want to respond with laughter instead of words!',
  'daily': 'The Daily tab has common phrases like Yes, No, Repeat, One Moment, Slower, and Thanks. These are quick responses you\'ll use often!',
  'calls': 'The Calls tab has phrases for phone calls like scheduling appointments, refilling prescriptions, asking about test results, and more.',
  'voice': 'To change the voice: Open Prefs > Voice Settings. You can choose from different voices and adjust the speed.',
  'speed': 'To change speaking speed: Open Prefs > Voice Settings and use the speed slider. Lower = slower speech.',
  'record': 'To record a custom button: Tap Record in the toolbar. Speak your phrase, edit if needed, then save it as a button!',
  'scripts': 'Scripts are longer phrases for specific situations. Find them in Prefs > Scripts Library, organized by category (Doctor, Pharmacy, etc).',
  'emergency': 'The red ! button in the corner is for urgent problems. Tap it to quickly report issues to Shannon.',
  'help': 'I can help with: making calls, adding phrases, laugh buttons, voice settings, recording, scripts, and more. What would you like to know?'
};

function askHelper() {
  const input = document.getElementById('helperInput');
  const question = input.value.trim().toLowerCase();
  if (!question) return;
  
  // Add user message
  addHelperMessage(input.value, 'user');
  input.value = '';
  
  // Find answer
  let answer = 'I\'m not sure about that. Try asking about: making calls, custom phrases, laugh buttons, voice settings, or recording.';
  
  for (const [key, value] of Object.entries(helperKnowledge)) {
    if (question.includes(key)) {
      answer = value;
      break;
    }
  }
  
  // Add assistant response
  setTimeout(() => {
    addHelperMessage(answer, 'assistant');
  }, 500);
}

function askHelperQuestion(q) {
  document.getElementById('helperInput').value = q;
  askHelper();
}

function addHelperMessage(text, type) {
  const chat = document.getElementById('helperChat');
  const msg = document.createElement('div');
  msg.className = 'helper-message ' + type;
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// ============================================
// EMERGENCY FEEDBACK
// ============================================
function openEmergencyFeedback() {
  document.getElementById('emergencyModal').classList.add('active');
}

function closeEmergencyModal() {
  document.getElementById('emergencyModal').classList.remove('active');
}

function sendEmergency(type) {
  const messages = {
    'voice-not-working': 'URGENT: Voice not working!',
    'buttons-stuck': 'URGENT: Buttons stuck!',
    'cant-hear': 'URGENT: Can\'t hear caller!',
    'app-frozen': 'URGENT: App frozen!'
  };
  
  const msg = messages[type] || 'URGENT: Unknown issue';
  saveEmergencyFeedback(msg);
  closeEmergencyModal();
  alert('Emergency feedback sent to Shannon!');
}

function sendEmergencyCustom() {
  const text = document.getElementById('emergencyText').value.trim();
  if (!text) {
    alert('Please describe the problem');
    return;
  }
  
  saveEmergencyFeedback('URGENT: ' + text);
  document.getElementById('emergencyText').value = '';
  closeEmergencyModal();
  alert('Emergency feedback sent to Shannon!');
}

function saveEmergencyFeedback(msg) {
  const feedback = JSON.parse(localStorage.getItem('robinEmergencyFeedback') || '[]');
  feedback.push({
    timestamp: new Date().toISOString(),
    message: msg,
    status: 'pending'
  });
  localStorage.setItem('robinEmergencyFeedback', JSON.stringify(feedback));
  
  // TODO: Send to Supabase when connected
  console.log('Emergency feedback saved:', msg);
}

// ============================================
// LAUGH RECORDING
// ============================================
let laughRecorder = null;
let laughChunks = [];
let currentLaughType = null;
let laughRecording = false;

function recordLaugh(type) {
  if (laughRecording && currentLaughType === type) {
    stopLaughRecording();
  } else {
    startLaughRecording(type);
  }
}

async function startLaughRecording(type) {
  // Stop any existing recording
  if (laughRecording) {
    stopLaughRecording();
  }
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    laughRecorder = new MediaRecorder(stream);
    laughChunks = [];
    currentLaughType = type;
    laughRecording = true;
    
    laughRecorder.ondataavailable = (e) => {
      laughChunks.push(e.data);
    };
    
    laughRecorder.onstop = () => {
      const blob = new Blob(laughChunks, { type: 'audio/webm' });
      saveLaughSound(type, blob);
      stream.getTracks().forEach(track => track.stop());
      
      // Update status
      const statusEl = document.getElementById('laughStatus-' + type);
      if (statusEl) statusEl.textContent = '✓ Recorded';
    };
    
    laughRecorder.start();
    
    // Update UI
    const btn = document.getElementById('laughRecBtn-' + type);
    if (btn) btn.classList.add('recording');
    
    const statusEl = document.getElementById('laughStatus-' + type);
    if (statusEl) statusEl.textContent = 'Recording...';
    
  } catch (err) {
    console.error('Mic error:', err);
    alert('Could not access microphone.');
  }
}

function stopLaughRecording() {
  if (laughRecorder && laughRecorder.state !== 'inactive') {
    laughRecorder.stop();
  }
  laughRecording = false;
  
  // Update UI
  if (currentLaughType) {
    const btn = document.getElementById('laughRecBtn-' + currentLaughType);
    if (btn) btn.classList.remove('recording');
  }
  currentLaughType = null;
}

function testLaugh(type) {
  playLaugh(type);
}

function clearLaugh(type) {
  localStorage.removeItem('robinLaugh_' + type);
  laughSounds[type] = null;
  
  const statusEl = document.getElementById('laughStatus-' + type);
  if (statusEl) statusEl.textContent = 'Not recorded';
}

// Update laugh statuses on modal open
function updateLaughStatuses() {
  ['chuckle', 'laugh', 'sarcastic'].forEach(type => {
    const stored = localStorage.getItem('robinLaugh_' + type);
    const statusEl = document.getElementById('laughStatus-' + type);
    if (statusEl) {
      statusEl.textContent = stored ? '✓ Recorded' : 'Not recorded';
    }
  });
}

// Override showAboutSection to update laugh statuses
const originalShowAboutSection = showAboutSection;
showAboutSection = function(section) {
  originalShowAboutSection(section);
  if (section === 'laughs') {
    updateLaughStatuses();
  }
};

// ============================================
// CALL HISTORY MODAL
// ============================================
function openCallHistoryModal() {
  closePrefsMenu();
  document.getElementById('callHistoryModal').classList.add('active');
  renderCallHistory();
  
  // Update toggle states
  const autoSum = localStorage.getItem('robinAutoSummarize') === 'true';
  const emailSum = localStorage.getItem('robinEmailSummary') === 'true';
  document.getElementById('toggleAutoSum')?.classList.toggle('active', autoSum);
  document.getElementById('toggleEmailSum')?.classList.toggle('active', emailSum);
}

function closeCallHistoryModal() {
  document.getElementById('callHistoryModal').classList.remove('active');
}

function toggleAutoSummarize() {
  const btn = document.getElementById('toggleAutoSum');
  btn.classList.toggle('active');
  localStorage.setItem('robinAutoSummarize', btn.classList.contains('active'));
}

function toggleEmailSummary() {
  const btn = document.getElementById('toggleEmailSum');
  btn.classList.toggle('active');
  localStorage.setItem('robinEmailSummary', btn.classList.contains('active'));
}

function renderCallHistory() {
  const list = document.getElementById('callHistoryList');
  const calls = JSON.parse(localStorage.getItem('robinCallHistory') || '[]');
  
  if (calls.length === 0) {
    list.innerHTML = '<p class="empty-msg">No calls recorded yet</p>';
    return;
  }
  
  list.innerHTML = calls.map((call, i) => `
    <div class="call-item">
      <span class="call-icon ${call.type}">${call.type === 'incoming' ? '📲' : call.type === 'outgoing' ? '📞' : '📵'}</span>
      <div class="call-info">
        <div class="call-caller">${call.callerId || 'Unknown'}</div>
        <div class="call-meta">${formatCallTime(call.timestamp)}</div>
      </div>
      <span class="call-duration">${call.duration || '--:--'}</span>
      ${call.summary ? `<button class="call-summary-btn" onclick="viewCallSummary(${i})">Summary</button>` : ''}
    </div>
  `).join('');
}

function formatCallTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function viewCallSummary(index) {
  const calls = JSON.parse(localStorage.getItem('robinCallHistory') || '[]');
  if (calls[index]?.summary) {
    alert(calls[index].summary);
  }
}

function exportCallHistory() {
  const calls = JSON.parse(localStorage.getItem('robinCallHistory') || '[]');
  if (calls.length === 0) {
    alert('No calls to export');
    return;
  }
  
  let content = `<html><head><title>Robin's Voice - Call History</title>
    <style>body{font-family:Arial;padding:20px}h1{color:#0077B6}.call{padding:15px;border:1px solid #ddd;margin:10px 0;border-radius:8px}</style>
    </head><body><h1>📞 Call History</h1><p>Exported: ${new Date().toLocaleString()}</p>`;
  
  calls.forEach(call => {
    content += `<div class="call">
      <strong>${call.callerId || 'Unknown'}</strong> - ${call.type}<br>
      ${formatCallTime(call.timestamp)} | Duration: ${call.duration || '--:--'}
      ${call.summary ? `<p><em>Summary: ${call.summary}</em></p>` : ''}
    </div>`;
  });
  
  content += '</body></html>';
  
  const w = window.open('', '_blank');
  w.document.write(content);
  w.document.close();
  w.print();
}

function clearCallHistory() {
  if (confirm('Clear all call history?')) {
    localStorage.removeItem('robinCallHistory');
    renderCallHistory();
  }
}

// Add a call to history (called when call ends)
function addCallToHistory(callerId, type, duration, summary) {
  const calls = JSON.parse(localStorage.getItem('robinCallHistory') || '[]');
  calls.unshift({
    callerId: callerId || 'Unknown',
    type: type || 'incoming',
    timestamp: new Date().toISOString(),
    duration: duration || '--:--',
    summary: summary || null
  });
  // Keep last 50 calls
  if (calls.length > 50) calls.pop();
  localStorage.setItem('robinCallHistory', JSON.stringify(calls));
}

// ============================================
// RECORDING PLAYER
// ============================================
let recordings = [];
let currentRecordingIndex = -1;
let playerAudio = null;

function loadRecordings() {
  recordings = JSON.parse(localStorage.getItem('robinRecordings') || '[]');
  renderRecordings();
}

function renderRecordings() {
  const list = document.getElementById('recordingList');
  const controls = document.getElementById('playerControls');
  
  if (recordings.length === 0) {
    list.innerHTML = '<p class="empty-msg">No recordings yet</p>';
    controls.style.display = 'none';
    return;
  }
  
  controls.style.display = 'block';
  list.innerHTML = recordings.map((rec, i) => `
    <div class="recording-item ${i === currentRecordingIndex ? 'active' : ''}" onclick="selectRecording(${i})">
      <span class="rec-icon">●</span>
      <div class="rec-info">
        <div class="rec-name">${rec.name || 'Recording ' + (i + 1)}</div>
        <div class="rec-time">${formatCallTime(rec.timestamp)}</div>
      </div>
      <span class="rec-duration">${rec.duration || '0:00'}</span>
    </div>
  `).join('');
}

function selectRecording(index) {
  currentRecordingIndex = index;
  renderRecordings();
  
  const rec = recordings[index];
  document.getElementById('playerTitle').textContent = rec.name || 'Recording ' + (index + 1);
  document.getElementById('playerTime').textContent = '0:00 / ' + (rec.duration || '0:00');
  document.getElementById('playerProgress').style.width = '0%';
}

function playerToggle() {
  if (currentRecordingIndex < 0 || !recordings[currentRecordingIndex]) return;
  
  const btn = document.getElementById('playerPlayBtn');
  
  if (playerAudio && !playerAudio.paused) {
    playerAudio.pause();
    btn.textContent = '▶';
  } else {
    const rec = recordings[currentRecordingIndex];
    if (rec.audio) {
      playerAudio = new Audio(rec.audio);
      playerAudio.onended = () => {
        btn.textContent = '▶';
        document.getElementById('playerProgress').style.width = '0%';
      };
      playerAudio.ontimeupdate = () => {
        const pct = (playerAudio.currentTime / playerAudio.duration) * 100;
        document.getElementById('playerProgress').style.width = pct + '%';
        const cur = Math.floor(playerAudio.currentTime);
        const dur = Math.floor(playerAudio.duration) || 0;
        document.getElementById('playerTime').textContent = 
          `${Math.floor(cur/60)}:${(cur%60).toString().padStart(2,'0')} / ${Math.floor(dur/60)}:${(dur%60).toString().padStart(2,'0')}`;
      };
      playerAudio.play();
      btn.textContent = '⏸';
    }
  }
}

function playerPrev() {
  if (currentRecordingIndex > 0) {
    selectRecording(currentRecordingIndex - 1);
  }
}

function playerNext() {
  if (currentRecordingIndex < recordings.length - 1) {
    selectRecording(currentRecordingIndex + 1);
  }
}

function clearRecordings() {
  if (confirm('Clear all recordings?')) {
    localStorage.removeItem('robinRecordings');
    recordings = [];
    currentRecordingIndex = -1;
    renderRecordings();
  }
}

// Save a recording (called from feedback or other recording features)
function saveRecording(name, audioDataUrl, duration) {
  recordings.unshift({
    name: name,
    audio: audioDataUrl,
    duration: duration,
    timestamp: new Date().toISOString()
  });
  // Keep last 20 recordings
  if (recordings.length > 20) recordings.pop();
  localStorage.setItem('robinRecordings', JSON.stringify(recordings));
  renderRecordings();
}

// Initialize recordings on load
document.addEventListener('DOMContentLoaded', loadRecordings);

// ============================================
// UTILITY FUNCTIONS
// ============================================
function showStatus(msg) {
  document.getElementById('statusText').textContent = msg;
  setTimeout(() => {
    document.getElementById('statusText').textContent = 'Ready';
  }, 3000);
}
