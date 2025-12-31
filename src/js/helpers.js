// Robin's Voice v1.1.0 - User Info Helpers

// ============================================
// NAME HELPERS
// ============================================
function getFirstName() {
  return state.info.pronounceFirst || state.info.firstName || 'Robin';
}

function getLastName() {
  return state.info.pronounceLast || state.info.lastName || '';
}

function getFullName() {
  const first = state.info.pronounceFirst || state.info.firstName || '';
  const last = state.info.pronounceLast || state.info.lastName || '';
  return (first + ' ' + last).trim() || 'Robin';
}

function getDisplayName() {
  return state.info.pronounceNick || state.info.nickname || 
         state.info.pronounceFirst || state.info.firstName || 'Robin';
}

function getFullAddress() {
  let a = state.info.address1 || '';
  if (state.info.address2) a += ', ' + state.info.address2;
  if (state.info.city) a += ', ' + state.info.city;
  if (state.info.state) a += ', ' + state.info.state;
  if (state.info.zip) a += ' ' + state.info.zip;
  return a || 'address not set';
}

function getPrimaryInsurance() {
  const p = state.insurances.find(i => i.type === 'Medical') || state.insurances[0];
  return p ? p.memberId : 'not set';
}

function getPrimaryPharmacy() {
  const p = state.pharmacies.find(p => p.primary) || state.pharmacies[0];
  return p ? p.name : 'not set';
}

// ============================================
// PLACEHOLDER REPLACEMENT
// ============================================
function replacePlaceholders(text) {
  return text
    .replace(/\[FIRST\]/g, getFirstName())
    .replace(/\[LAST\]/g, getLastName())
    .replace(/\[FULL_NAME\]/g, getFullName())
    .replace(/\[DOB\]/g, state.info.dob || '[DOB]')
    .replace(/\[PHONE\]/g, state.info.phone || '[PHONE]')
    .replace(/\[ADDRESS\]/g, getFullAddress())
    .replace(/\[INSURANCE\]/g, getPrimaryInsurance())
    .replace(/\[PHARMACY\]/g, getPrimaryPharmacy())
    .replace(/\[NAME\]/g, getFullName());
}

// ============================================
// HEADER UPDATE
// ============================================
function updateHeaderName() {
  const name = state.info.nickname || state.info.firstName || '';
  document.getElementById('headerSubtitle').textContent = 
    name ? name + "'s Voice Assistant" : "Your Voice Assistant";
}

function updateBtnLabels() {
  document.getElementById('introBtnText').textContent = state.introLabel;
  document.getElementById('verifyBtnText').textContent = state.verifyLabel;
}

// ============================================
// LOAD/SAVE INFO
// ============================================
function loadInfoFields() {
  document.getElementById('firstName').value = state.info.firstName || '';
  document.getElementById('lastName').value = state.info.lastName || '';
  document.getElementById('nickname').value = state.info.nickname || '';
  document.getElementById('pronounceFirst').value = state.info.pronounceFirst || '';
  document.getElementById('pronounceLast').value = state.info.pronounceLast || '';
  document.getElementById('dob').value = state.info.dob || '';
  document.getElementById('phone').value = state.info.phone || '';
  document.getElementById('address1').value = state.info.address1 || '';
  document.getElementById('address2').value = state.info.address2 || '';
  document.getElementById('city').value = state.info.city || '';
  document.getElementById('state').value = state.info.state || '';
  document.getElementById('zip').value = state.info.zip || '';
  
  // Load Twilio status
  if (localStorage.getItem('robinTwilioSid')) {
    document.getElementById('twilioSid').value = '••••••••';
    document.getElementById('twilioToken').value = '••••••••';
    document.getElementById('twilioStatus').textContent = '✓ Saved';
    document.getElementById('twilioStatus').className = 'key-status saved';
  }
}

function autoSaveInfo() {
  state.info = {
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    nickname: document.getElementById('nickname').value.trim(),
    pronounceFirst: document.getElementById('pronounceFirst').value.trim(),
    pronounceLast: document.getElementById('pronounceLast').value.trim(),
    dob: document.getElementById('dob').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    address1: document.getElementById('address1').value.trim(),
    address2: document.getElementById('address2').value.trim(),
    city: document.getElementById('city').value.trim(),
    state: document.getElementById('state').value.trim(),
    zip: document.getElementById('zip').value.trim()
  };
  localStorage.setItem('robinInfo', JSON.stringify(state.info));
  updateHeaderName();
}

function saveInfo() {
  autoSaveInfo();
  document.getElementById('statusText').textContent = '✓ Saved!';
  setTimeout(() => {
    document.getElementById('statusText').textContent = 'Ready';
  }, 2000);
}

// ============================================
// API KEYS
// ============================================
function saveApiKey() {
  const k = document.getElementById('apiKey').value.trim();
  if (k && !k.includes('•')) {
    state.apiKey = k;
    localStorage.setItem('robinApiKey', k);
    document.getElementById('apiKey').value = '••••••••••••';
    document.getElementById('keyStatus').textContent = '✓ Saved';
    document.getElementById('keyStatus').className = 'key-status saved';
    loadVoices();
  }
}

function saveClaudeKey() {
  const k = document.getElementById('claudeKey').value.trim();
  if (k && !k.includes('•')) {
    state.claudeKey = k;
    localStorage.setItem('robinClaudeKey', k);
    document.getElementById('claudeKey').value = '••••••••••••';
    document.getElementById('claudeStatus').textContent = '✓ Saved';
    document.getElementById('claudeStatus').className = 'key-status saved';
  }
}

function saveTwilioKeys() {
  const sid = document.getElementById('twilioSid').value.trim();
  const token = document.getElementById('twilioToken').value.trim();
  
  if (sid && !sid.includes('•')) {
    localStorage.setItem('robinTwilioSid', sid);
    TWILIO_CONFIG.accountSid = sid;
  }
  if (token && !token.includes('•')) {
    localStorage.setItem('robinTwilioToken', token);
    TWILIO_CONFIG.authToken = token;
  }
  
  document.getElementById('twilioSid').value = '••••••••';
  document.getElementById('twilioToken').value = '••••••••';
  document.getElementById('twilioStatus').textContent = '✓ Saved';
  document.getElementById('twilioStatus').className = 'key-status saved';
}
