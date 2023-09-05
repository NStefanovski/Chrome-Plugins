document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('saveApiKey');
  
    // Load the stored API key when the options page is opened
    chrome.storage.sync.get('apiKey', (data) => {
      apiKeyInput.value = data.apiKey || '';
    });
  
    // Save the API key when the save button is clicked
    saveButton.addEventListener('click', () => {
      const apiKey = apiKeyInput.value;
      chrome.storage.sync.set({ apiKey: apiKey }, () => {
        alert('API key saved successfully.');
      });
    });
  });
  