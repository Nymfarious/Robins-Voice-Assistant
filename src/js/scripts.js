// Robin's Voice v1.4.2 - Scripts & History

// ============================================
// HISTORY
// ============================================
function addHistory(text, metadata = {}) {
  state.history.unshift({
    text: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
    full: text,
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString(),
    callerId: metadata.callerId || null,
    duration: metadata.duration || null,
    summary: metadata.summary || null
  });
  
  if (state.history.length > 50) state.history.pop();
  localStorage.setItem('robinHistory', JSON.stringify(state.history));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('historyList');
  
  if (!state.history.length) {
    list.innerHTML = '<p style="color:var(--text-muted);padding:10px;">Call history appears here</p>';
    return;
  }
  
  list.innerHTML = state.history.map((h, i) => `
    <div class="history-item${h.callerId ? ' enhanced' : ''}" onclick="document.getElementById('customText').value=state.history[${i}].full">
      ${h.callerId ? `
        <div class="history-header">
          <span class="history-caller">${h.callerId}</span>
          <span class="history-time">${h.time}</span>
        </div>
        <div class="history-text">${h.text}</div>
        ${h.duration ? `<div class="history-duration">⏱️ ${h.duration}</div>` : ''}
        ${h.summary ? `<div class="history-summary">📝 ${h.summary}</div>` : ''}
      ` : `
        <span class="time">${h.time}</span> ${h.text}
      `}
    </div>
  `).join('');
}

function clearHistory() {
  if (confirm('Clear all history?')) {
    state.history = [];
    localStorage.removeItem('robinHistory');
    renderHistory();
  }
}

// ============================================
// MY SCRIPTS
// ============================================
function renderMyScripts() {
  const grid = document.getElementById('scriptsGrid');
  
  grid.innerHTML = state.myScripts.length 
    ? state.myScripts.map(s => 
        `<div class="script-card" onclick="speak(\`${s.text.replace(/`/g, '\\`')}\`)">
          <div class="script-icon">${s.icon || '⭐'}</div>
          <div class="script-name">${s.name}</div>
          <div class="script-preview">${s.text}</div>
          <button class="delete-script" onclick="event.stopPropagation();deleteMyScript(${s.id})">✕</button>
        </div>`
      ).join('')
    : '<div class="no-scripts">Tap "+ New"</div>';
  
  renderQuickScripts();
}

function renderQuickScripts() {
  const container = document.getElementById('quickScripts');
  const quick = state.myScripts.filter(s => s.quick !== false);
  
  container.innerHTML = quick.length 
    ? quick.map(s => 
        `<button class="quick-script-btn" onclick="speak(\`${s.text.replace(/`/g, '\\`')}\`)">
          <span>${s.icon}</span>${s.name}
        </button>`
      ).join('')
    : '';
}

function saveMyScript() {
  const name = document.getElementById('myScriptName').value.trim();
  const text = document.getElementById('myScriptText').value.trim();
  const quick = document.getElementById('myScriptQuick').value === 'yes';
  
  if (!name || !text) {
    alert('Fill name and text');
    return;
  }
  
  state.myScripts.push({
    id: Date.now(),
    name,
    text,
    icon: state.selectedIcon,
    quick
  });
  
  localStorage.setItem('robinScripts', JSON.stringify(state.myScripts));
  renderMyScripts();
  closeMyScriptModal();
}

function deleteMyScript(id) {
  state.myScripts = state.myScripts.filter(s => s.id !== id);
  localStorage.setItem('robinScripts', JSON.stringify(state.myScripts));
  renderMyScripts();
}

// ============================================
// FULL SCRIPTS
// ============================================
function showScriptsCat(cat, btn) {
  state.currentCat = cat;
  document.querySelectorAll('.script-tabs .modal-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderFullScripts();
}

function renderFullScripts() {
  const list = state.fullScripts[state.currentCat] || [];
  const container = document.getElementById('fullScriptsList');
  
  if (!container) return;
  
  container.innerHTML = list.length 
    ? list.map(s => 
        `<div class="script-item">
          <div class="script-item-header">
            <span class="script-item-title">${s.name}</span>
            <div>
              <button class="script-item-btn" onclick="speakFullScript(${s.id})">▶️</button>
              <button class="script-item-btn" onclick="deleteFullScript(${s.id})">🗑️</button>
            </div>
          </div>
          <div class="script-item-text">${replacePlaceholders(s.text)}</div>
        </div>`
      ).join('')
    : '<div class="loading-msg">No scripts in this category</div>';
}

function speakFullScript(id) {
  const script = (state.fullScripts[state.currentCat] || []).find(x => x.id === id);
  if (script) speak(replacePlaceholders(script.text));
}

function deleteFullScript(id) {
  state.fullScripts[state.currentCat] = state.fullScripts[state.currentCat].filter(s => s.id !== id);
  localStorage.setItem('robinFullScripts', JSON.stringify(state.fullScripts));
  renderFullScripts();
}

function showCreateScript() {
  document.getElementById('scriptsView').style.display = 'none';
  document.getElementById('scriptsCreate').style.display = 'block';
}

function showBrowseScripts() {
  document.getElementById('scriptsView').style.display = 'block';
  document.getElementById('scriptsCreate').style.display = 'none';
  // Clear form
  document.getElementById('scriptDescribe').value = '';
  document.getElementById('scriptTextarea').value = '';
  document.getElementById('scriptName').value = '';
}

async function generateScript() {
  const desc = document.getElementById('scriptDescribe').value.trim();
  
  if (!desc) {
    alert('Describe what you need');
    return;
  }
  
  if (!state.claudeKey) {
    alert('Add Claude API key in Info → API tab');
    return;
  }
  
  document.getElementById('scriptTextarea').value = 'Generating...';
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': state.claudeKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `Write a phone script for Robin who uses a voice assistant to communicate. Need: ${desc}\n\nStart with "Hi, this is Robin." Use placeholders: [FIRST], [LAST], [FULL_NAME], [DOB], [ADDRESS], [INSURANCE], [PHARMACY]. Keep it natural and concise.`
        }]
      })
    });
    
    const data = await response.json();
    document.getElementById('scriptTextarea').value = data.content[0].text;
    
  } catch (e) {
    document.getElementById('scriptTextarea').value = 'Error: ' + e.message;
  }
}

function saveFullScript() {
  const name = document.getElementById('scriptName').value.trim();
  const text = document.getElementById('scriptTextarea').value.trim();
  const cat = document.getElementById('scriptCat').value;
  
  if (!name || !text) {
    alert('Fill name and script text');
    return;
  }
  
  state.fullScripts[cat].push({
    id: Date.now(),
    name,
    text
  });
  
  localStorage.setItem('robinFullScripts', JSON.stringify(state.fullScripts));
  showBrowseScripts();
  
  // Switch to the category we just added to
  state.currentCat = cat;
  renderFullScripts();
}
