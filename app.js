const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  appendMessage('user', text);
  userInput.value = '';

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Ersetze "YOUR_OPENROUTER_API_KEY" durch deinen echten API-Schlüssel
        'Authorization': 'Bearer YOUR_OPENROUTER_API_KEY'
      },
      body: JSON.stringify({
        model: 'openai/4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that responds in German.' },
          { role: 'user', content: text }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    });
    const data = await response.json();
    const reply = data.choices && data.choices.length ? data.choices[0].message.content.trim() : 'Keine Antwort.';
    appendMessage('assistant', reply);
  } catch (error) {
    appendMessage('assistant', 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.');
  }
}

function appendMessage(role, content) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;
  messageDiv.textContent = content;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
