chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showGeneratedText') {
      document.getElementById('generatedText').textContent = request.generatedText;
    }
  });
  