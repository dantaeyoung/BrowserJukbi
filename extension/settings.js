document.addEventListener("DOMContentLoaded", function() {
    const saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", saveSettings);

    // Load settings when the settings page is opened
    loadSettings();
});

function saveSettings() {
    const brokerHost = document.getElementById("brokerHost").value;
    const brokerPort = document.getElementById("brokerPort").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Save settings to Chrome's storage
    chrome.storage.sync.set({
        brokerHost: brokerHost,
        brokerPort: brokerPort,
        username: username,
        password: password
    }, function() {
        console.log("Settings saved.");
    });
}

function loadSettings() {
    // Load settings from Chrome's storage
    chrome.storage.sync.get(["brokerHost", "brokerPort", "username", "password"], function(result) {
        document.getElementById("brokerHost").value = result.brokerHost || "";
        document.getElementById("brokerPort").value = result.brokerPort || "";
        document.getElementById("username").value = result.username || "";
        document.getElementById("password").value = result.password || "";
    });
}

