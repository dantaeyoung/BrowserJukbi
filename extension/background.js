importScripts("paho-mqtt.js");

function getDomainFromUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname; // Returns the domain if URL is valid
    } catch (error) {
        return url; // Returns the original URL if error occurs
    }
}


// Function to establish MQTT connection
function connectToMQTT() {
    // Load settings from Chrome's storage
    chrome.storage.sync.get(["brokerHost", "brokerPort", "username", "password"], function(result) {
        const brokerHost = result.brokerHost;
        const brokerPort = Number(result.brokerPort);
        const username = result.username;
        const password = result.password;

        console.log(brokerHost, brokerPort, username, password)

        var client = new Paho.Client(brokerHost, brokerPort, "sitesnooper-" + new Date().getTime());


        // Set callback handlers
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        // Connect the client
        client.connect({
            onSuccess:onConnect,
            userName: username,
            password: password,
        });

        function sendUpdatedDomain(url) {

            var msg = getDomainFromUrl(url) 

            message = new Paho.Message(msg);
            message.destinationName = "homeassistant/sensor/sitesnooper/url/state";
            client.send(message);

        }

        function sendHADiscovery() {
          discoverypayload = { 
              'command_topic': "homeassistant/sensor/sitesnooper/url/set",
              'state_topic': "homeassistant/sensor/sitesnooper/url/state",
              "unique_id": "url",
              "name": "URL",
              "device":{
                 "identifiers":[
                    "sitesnooper"
                 ],
                 "name":"SiteSnoooper"
              }

          }

          discoverymessage = new Paho.Message(JSON.stringify(discoverypayload));
          discoverymessage.destinationName = "homeassistant/sensor/sitesnooper/url/config";
          client.send(discoverymessage);
        }


        // Called when the client connects
        function onConnect() {
        console.log("Connected to Mosquitto server");
        
          sendHADiscovery();
          //mstr = "sitesnooper connected -" + new Date().getTime();

          //sendUpdatedDomain(mstr)
        }

        // Called when the client loses its connection
        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("Connection Lost:", responseObject.errorMessage);
            }
        }

        // Called when a message arrives
        function onMessageArrived(message) {
            console.log("Message Arrived:", message.payloadString);
        }

/*
        // Listen for messages from content script indicating new page navigation
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.message === "newPageLoaded") {
                const domain = request.domain;
                sendUpdatedDomain(domain)
            }
        }); */

            chrome.tabs.onActivated.addListener(function(activeInfo) {
                chrome.tabs.get(activeInfo.tabId, function(tab) {
                    console.log('Tab activated:', tab.url);
                    sendUpdatedDomain(tab.url)
                });
            });

            chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
                if (changeInfo.url) {
                    console.log('Tab URL changed:', changeInfo.url);
                    sendUpdatedDomain(changeInfo.url)
                }
            });




    });
}

// Call the connectToMQTT function to establish the connection
connectToMQTT();


