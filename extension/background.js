importScripts("paho-mqtt.js");

function getDomainFromUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname; // Returns the domain if URL is valid
    } catch (error) {
        return url; // Returns the original URL if error occurs
    }
}

function getDomainWithoutSubdomain(url) {
  const domain = new URL(url).hostname;
  const domainParts = domain.split('.');
  if (domainParts.length >= 2) {
    return `${domainParts[domainParts.length - 2]}.${domainParts[domainParts.length - 1]}`;
  }
  return domain;
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

        var client = new Paho.Client(brokerHost, brokerPort, "browserjukbi-" + new Date().getTime());


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

            var domain = getDomainWithoutSubdomain(url) 

            message = new Paho.Message(domain);
            message.destinationName = "homeassistant/sensor/browserjukbi/url/state";
            client.send(message);

            message = new Paho.Message(domain);
            message.destinationName = "browserjukbi";
            client.send(message);
        }

        function sendHADiscovery() {
          discoverypayload = { 
              'command_topic': "homeassistant/sensor/browserjukbi/url/set",
              'state_topic': "homeassistant/sensor/browserjukbi/url/state",
              "unique_id": "browserjukbiurl",
              "name": "BrowserJukbiURL",
              "device":{
                 "identifiers":[
                    "browserjukbi"
                 ],
                 "name":"BrowserJukbi"
              }

          }

          discoverymessage = new Paho.Message(JSON.stringify(discoverypayload));
          discoverymessage.destinationName = "homeassistant/sensor/browserjukbi/url/config";
          client.send(discoverymessage);
            console.log("Sent discoveryMessage");
        }


        // Called when the client connects
        function onConnect() {
            console.log("Connected to Mosquitto server");
          sendHADiscovery();
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


