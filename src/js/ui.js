// Robin's Voice v1.1.0 - UI Functions

// ============================================
// COLLAPSE
// ============================================
function toggleCollapse(id) {
  const content = document.getElementById(id + '-content');
  content.classList.toggle('collapsed');
  content.previousElementSibling.classList.toggle('collapsed');
}

// ============================================
// TABS
// ============================================
function showTab(tab, btn) {
  document.querySelectorAll('#tab-common, #tab-info, #tab-calls').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.card .tabs .tab').forEach(x => x.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  btn.classList.add('active');
}

function showInfoTab(tab, btn) {
  document.querySelectorAll('.info-tab-content').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('#infoModal .modal-tab').forEach(x => x.classList.remove('active'));
  document.getElementById('info-' + tab).classList.add('active');
  btn.classList.add('active');
}

// ============================================
// MODALS
// ============================================
function openInfoModal() {
  document.getElementById('infoModal').classList.add('active');
  loadInfoFields();
}

function closeInfoModal() {
  document.getElementById('infoModal').classList.remove('active');
  autoSaveInfo();
}

function openVoiceModal() {
  document.getElementById('voiceModal').classList.add('active');
  if (state.apiKey && !state.allVoices.length) loadVoices();
}

function closeVoiceModal() {
  document.getElementById('voiceModal').classList.remove('active');
}

function openFullScriptsModal() {
  document.getElementById('fullScriptsModal').classList.add('active');
  renderFullScripts();
}

function closeFullScriptsModal() {
  document.getElementById('fullScriptsModal').classList.remove('active');
}

function openAgentsModal() {
  // Legacy - redirect to smart modal
  openSmartModal();
}

function closeAgentsModal() {
  closeSmartModal();
}

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

function openAddInsuranceModal() {
  document.getElementById('addInsuranceModal').classList.add('active');
}

function closeAddInsuranceModal() {
  document.getElementById('addInsuranceModal').classList.remove('active');
}

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
  document.querySelectorAll('.icon-option').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedIcon = el.dataset.icon;
}

// ============================================
// TOGGLE SETTINGS
// ============================================
function toggleSetting(setting) {
  const id = 'toggle' + setting.charAt(0).toUpperCase() + setting.slice(1);
  document.getElementById(id).classList.toggle('active');
}
