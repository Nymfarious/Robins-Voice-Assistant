// Robin's Voice v1.1.0 - Recording Module
// Voice recording, transcription, and button creation

// ============================================
// RECORDING STATE
// ============================================
let mediaRecorder = null;
let audioChunks = [];
let recordingStartTime = null;
let recordingTimer = null;
let isRecording = false;
let recognition = null;
let selectedRecordIcon = '⭐';

// ============================================
// RECORDING MODAL
// ============================================
function openRecordingModal() {
  document.getElementById('recordingModal').classList.add('active');
  resetRecording();
  initSpeechRecognition();
}

function closeRecordingModal() {
  document.getElementById('recordingModal').classList.remove('active');
  stopRecording();
  resetRecording();
}

// ============================================
// SPEECH RECOGNITION SETUP
// ============================================
function initSpeechRecognition() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    document.getElementById('recordStatus').textContent = '⚠️ Speech recognition not supported';
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  
  recognition.onresult = (event) => {
    let finalTranscript = '';
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    const textArea = document.getElementById('transcribedText');
    if (finalTranscript) {
      textArea.value = (textArea.value + ' ' + finalTranscript).trim();
    }
    
    // Show transcription section when we have text
    if (textArea.value) {
      document.getElementById('transcriptionSection').style.display = 'block';
      document.getElementById('saveButtonSection').style.display = 'block';
    }
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    if (event.error === 'no-speech') {
      document.getElementById('recordStatus').textContent = 'No speech detected. Try again.';
    }
  };
  
  recognition.onend = () => {
    if (isRecording) {
      // Restart if still recording
      try {
        recognition.start();
      } catch (e) {
        console.log('Recognition restart error:', e);
      }
    }
  };
}

// ============================================
// RECORDING CONTROLS
// ============================================
function toggleRecording() {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

function startRecording() {
  isRecording = true;
  recordingStartTime = Date.now();
  
  // Update UI
  document.getElementById('recordBtn').classList.add('recording');
  document.getElementById('recordBtnText').textContent = 'Stop Recording';
  document.getElementById('recordStatus').textContent = '🔴 Recording...';
  document.getElementById('recordStatus').classList.add('recording');
  
  // Start timer
  recordingTimer = setInterval(updateRecordingTimer, 1000);
  
  // Start speech recognition
  if (recognition) {
    try {
      recognition.start();
    } catch (e) {
      console.log('Recognition start error:', e);
    }
  }
  
  // Also record audio for potential future use
  startAudioRecording();
}

function stopRecording() {
  isRecording = false;
  
  // Update UI
  document.getElementById('recordBtn').classList.remove('recording');
  document.getElementById('recordBtnText').textContent = 'Start Recording';
  document.getElementById('recordStatus').textContent = 'Recording complete';
  document.getElementById('recordStatus').classList.remove('recording');
  
  // Stop timer
  if (recordingTimer) {
    clearInterval(recordingTimer);
    recordingTimer = null;
  }
  
  // Stop speech recognition
  if (recognition) {
    try {
      recognition.stop();
    } catch (e) {
      console.log('Recognition stop error:', e);
    }
  }
  
  // Stop audio recording
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}

function updateRecordingTimer() {
  const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  document.getElementById('recordTimer').textContent = 
    `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ============================================
// AUDIO RECORDING (for future use)
// ============================================
async function startAudioRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
    
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      // Store for potential playback or saving
      state.lastRecordedAudio = audioBlob;
    };
    
    mediaRecorder.start();
  } catch (err) {
    console.error('Error accessing microphone:', err);
  }
}

// ============================================
// TRANSCRIPTION PREVIEW
// ============================================
function speakTranscription() {
  const text = document.getElementById('transcribedText').value;
  if (text) {
    speak(text, true);
  }
}

// ============================================
// SAVE AS BUTTON
// ============================================
function selectRecordIcon(el) {
  document.querySelectorAll('#recordIconPicker .icon-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  el.classList.add('selected');
  selectedRecordIcon = el.dataset.icon;
}

function saveRecordedButton() {
  const text = document.getElementById('transcribedText').value.trim();
  const name = document.getElementById('recordBtnName').value.trim();
  const desc = document.getElementById('recordBtnDesc').value.trim();
  
  if (!text) {
    alert('Please record something first!');
    return;
  }
  
  if (!name) {
    alert('Please enter a button name.');
    return;
  }
  
  // Create new script
  const newScript = {
    id: Date.now(),
    icon: selectedRecordIcon,
    name: name,
    description: desc,
    text: text,
    quick: true,
    createdAt: new Date().toISOString(),
    source: 'recording'
  };
  
  // Add to myScripts
  state.myScripts.push(newScript);
  localStorage.setItem('robinScripts', JSON.stringify(state.myScripts));
  
  // Refresh UI
  renderMyScripts();
  renderQuickScripts();
  
  // Close modal
  closeRecordingModal();
  
  // Show success
  document.getElementById('statusText').textContent = `✓ "${name}" button created!`;
  setTimeout(() => {
    document.getElementById('statusText').textContent = 'Ready';
  }, 3000);
}

function resetRecording() {
  // Stop everything
  stopRecording();
  
  // Reset UI
  document.getElementById('recordTimer').textContent = '0:00';
  document.getElementById('recordStatus').textContent = 'Ready to record';
  document.getElementById('recordStatus').classList.remove('recording');
  document.getElementById('transcribedText').value = '';
  document.getElementById('recordBtnName').value = '';
  document.getElementById('recordBtnDesc').value = '';
  document.getElementById('transcriptionSection').style.display = 'none';
  document.getElementById('saveButtonSection').style.display = 'none';
  
  // Reset icon selection
  selectedRecordIcon = '⭐';
  document.querySelectorAll('#recordIconPicker .icon-option').forEach(opt => {
    opt.classList.remove('selected');
    if (opt.dataset.icon === '⭐') opt.classList.add('selected');
  });
}

// ============================================
// SMART MODAL
// ============================================
function openSmartModal() {
  document.getElementById('smartModal').classList.add('active');
}

function closeSmartModal() {
  document.getElementById('smartModal').classList.remove('active');
}

// ============================================
// HISTORY ENHANCEMENTS
// ============================================
function toggleAutoSummarize() {
  const btn = document.getElementById('toggleAutoSum');
  btn.classList.toggle('active');
  const enabled = btn.classList.contains('active');
  localStorage.setItem('robinAutoSummarize', enabled);
}

function exportHistoryPDF() {
  // Create printable content
  const history = state.history || [];
  
  if (history.length === 0) {
    alert('No history to export.');
    return;
  }
  
  let content = `
    <html>
    <head>
      <title>Robin's Voice - Call History</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #0077B6; border-bottom: 2px solid #00B4D8; padding-bottom: 10px; }
        .call { margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
        .call-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .call-time { color: #666; font-size: 0.9em; }
        .call-duration { color: #0077B6; font-weight: bold; }
        .call-caller { color: #333; font-weight: bold; }
        .call-text { margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px; }
        .call-summary { margin-top: 10px; padding: 10px; background: #e8f4f8; border-radius: 4px; border-left: 3px solid #00B4D8; }
        .footer { margin-top: 30px; text-align: center; color: #999; font-size: 0.8em; }
      </style>
    </head>
    <body>
      <h1>🪷 Robin's Voice - Call History</h1>
      <p>Exported: ${new Date().toLocaleString()}</p>
  `;
  
  history.forEach((item, index) => {
    content += `
      <div class="call">
        <div class="call-header">
          <span class="call-caller">${item.callerId || 'Unknown Caller'}</span>
          <span class="call-time">${item.time || 'Unknown time'}</span>
        </div>
        ${item.duration ? `<div class="call-duration">Duration: ${item.duration}</div>` : ''}
        <div class="call-text">${item.text}</div>
        ${item.summary ? `<div class="call-summary"><strong>Summary:</strong> ${item.summary}</div>` : ''}
      </div>
    `;
  });
  
  content += `
      <div class="footer">Generated by Robin's Voice Assistant v1.1.0</div>
    </body>
    </html>
  `;
  
  // Open print window
  const printWindow = window.open('', '_blank');
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.print();
}

// Enhanced history rendering
function renderEnhancedHistory() {
  const list = document.getElementById('historyList');
  const history = state.history || [];
  
  if (history.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);padding:10px;">Call history appears here</p>';
    return;
  }
  
  list.innerHTML = history.map((item, i) => `
    <div class="history-item enhanced" onclick="speak('${item.text.replace(/'/g, "\\'")}')">
      <div class="history-header">
        <span class="history-caller">${item.callerId || '📞'}</span>
        <span class="history-time">${item.time || ''}</span>
      </div>
      <div class="history-text">${item.text}</div>
      ${item.duration ? `<div class="history-duration">⏱️ ${item.duration}</div>` : ''}
      ${item.summary ? `<div class="history-summary">📝 ${item.summary}</div>` : ''}
    </div>
  `).join('');
}

// Initialize auto-summarize toggle on load
document.addEventListener('DOMContentLoaded', () => {
  const autoSum = localStorage.getItem('robinAutoSummarize') === 'true';
  if (autoSum) {
    document.getElementById('toggleAutoSum')?.classList.add('active');
  }
});
