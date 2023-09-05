async function sendTextToAPI(selectedText) {
    chrome.storage.sync.get('apiKey', async (data) => {
      const apiKey = data.apiKey;
  
      if (!apiKey) {
        alert('Please set your API key in the extension settings.');
        return;
      }
  
      const apiEndpoint = 'https://api.openai.com/v1/engines/davinci/completions'; // Correct GPT-3 API endpoint
  
      const promptPrefix = 'Explain the following to a 7-year-old: ';
      const fullPrompt = promptPrefix + selectedText;
  
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            prompt: fullPrompt,
            max_tokens: 100, // Adjust the number of tokens as needed
            n: 1,
            stop: null,
            temperature: 0.7
          })
        });
  
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
  
        const data = await response.json();
        const generatedText = data.choices && data.choices[0] && data.choices[0].text;
        showPopup(generatedText);
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }
  
  
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'sendTextToAPI',
      title: 'Explain this Thing',
      contexts: ['selection']
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'sendTextToAPI') {
      sendTextToAPI(info.selectionText);
    }
  });
  
  function showPopup(generatedText) {
    chrome.windows.create(
      {
        url: 'popup.html',
        type: 'popup',
        width: 400,
        height: 300,
      },
      (popupWindow) => {
        // Wait for the new window to finish loading
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (changeInfo.status === 'complete' && tabId === popupWindow.tabs[0].id) {
            chrome.tabs.onUpdated.removeListener(listener);
  
            // Send the generated text to the new window
            chrome.tabs.sendMessage(popupWindow.tabs[0].id, {
              action: 'showGeneratedText',
              generatedText: generatedText,
            });
          }
        });
      }
    );
  }
  
  