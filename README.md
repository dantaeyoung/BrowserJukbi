# Browser Jukbi

Browser Jukbi is a Chrome extension + Home Assistant integration that alerts you back to a state of focus.

![jukbi.jpeg](jukbi.jpeg)

# How it works

A Chrome extension sends domains to Home Assistant upon URL/tab change.
A series of Home Assistant Helpers and automations change a light or (ideally) play a sound when you're switching domains too fast.


# Extension Setup

This connects to Home Assistant through an MQTT broker.

1. Go to `chrome://extensions` and turn on Developer mode
2. Load unpacked extension
3. Go to extensions menu and click on 'Browser Jukbi' > Options to set MQTT server settings.

**Your MQTT broker must be listening on websockets as well.**

If you're using mosquitto, you may have to edit your `mosquitto.conf` file, and add following:
```
listener 9002
protocol websockets
```

# Home Assistant Setup

1. You should see `sensor.browserjukbi_url` created in Home Assistant.
2. Create a Template sensor helper called `sensor.browserjukbi_update_time`. The template value should be
`{{ states.sensor.sitesnoooper_url.last_changed }}`.
3. Create a Template sensor helper called `sensor.browserjukbi_time_since_update`. The template value should be
`{{ as_timestamp(now())  - as_timestamp(states.sensor.sitesnoooper_url.last_changed) }}`. (This will only update once a minute; I understand this is HA's constraint.)
4. Create a Helper Threshold Sensor called `sensor.browserjukbi_indistraction`. The value should work off of `sensor.browserjukbi_time_since_update`, and the  `hysterisis` set to `0`, `max` set be `60` (or whatever other duration of seconds you deem is appropriate).
5. Lastly, create an automation. This will either trigger when the domain of the page navigated to changes on Chrome, or when 60 seconds passes without a domain change. Here's the YAML file:
```
alias: Browser Jukbi - inDistraction - Handle Change
description: ""
trigger:
  - platform: state
    entity_id:
      - binary_sensor.browserjukbi_indistraction
    enabled: true
    from: "on"
    to: "off"
  - platform: state
    entity_id:
      - sensor.browserjukbi_update_time
condition: []
action:
  - choose:
      - conditions:
          - condition: state
            entity_id: binary_sensor.browserjukbi_indistraction
            state: "on"
        sequence:
          - service: light.turn_on
            metadata: {}
            data:
              rgb_color:
                - 219
                - 31
                - 31
            target:
              entity_id: light.black_reading_light
          
      - conditions:
          - condition: state
            entity_id: binary_sensor.browserjukbi_indistraction
            state: "off"
        sequence:
          - service: light.turn_on
            metadata: {}
            data:
              rgb_color:
                - 45
                - 83
                - 235
            target:
              entity_id: light.black_reading_light
          
mode: single
```

