// Extract domain from URL// Send message to background script indicating new page loaded
chrome.runtime.sendMessage({ message: "newPageLoaded", domain: window.location.hostname });

