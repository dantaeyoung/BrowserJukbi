# SiteSnooper

SiteSnooper is a Chrome extension that sends domains to Home Assistant upon URL/tab change.

# Extension Setup

This connects to Home Assistant through an MQTT broker.

1. Go to `chrome://extensions` and turn on Developer mode
2. Load unpacked extension
3. Go to extensions menu and click on 'SiteSnooper' > Options to set MQTT server settings.

**Your MQTT broker must be listening on websockets as well.**

If you're using mosquitto, you may have to edit your `mosquitto.conf` file, and add following:
```
listener 9002
protocol websockets
```

# Home Assistant Setup

1. You should see `sensor.sitesnooper_url` created in Home Assistant.
2. Create a Template sensor helper called `sensor.sitesnooper_update_time`. The template value should be
`{{ states.sensor.sitesnoooper_url.last_changed }}`.
3. Create a Template sensor helper called `sensor.sitesnooper_duration_since_update`. The template value should be
`{{ as_timestamp(now())  - as_timestamp(states.sensor.sitesnoooper_url.last_changed) }}`. (This will update once a minute, max)
4. Create a Helper Threshold Sensor called `sensor.sitesnooper_inDistraction`. The threshold s
