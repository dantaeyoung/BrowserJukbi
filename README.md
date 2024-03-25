# Browser Jukbi

Browser Jukbi is a Chrome extension + Home Assistant integration that alerts you back to a state of focus.

![jukbi.jpeg](jukbi.jpeg)

The _jukbi_ is also known as the Seon stick, Awakening stick, Keisaku, xiāng bǎn, or [kyōsaku](https://en.wikipedia.org/wiki/Keisaku_).

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

2. Create two Helpers - input_numbers. 

 - `input_number.browserjukbi_alert_level`: 'BrowserJukbi Alert Level'
 - `input_number.browserjukbi_previous_alert_level`: 'BrowserJukbi Previous Alert Level'

3. Create three automations:

 - 'BrowserJukbi - 1. Jukbi Alerting' 
 - 'BrowserJukbi - 2. Jukbi Alertness Decay'
 - 'BrowserJukbi - 3. Alert Level to Notification' 

The first automation raises the 'alert level' of the Jukbi. 

The second automation triggers every 30 seconds and gradually decays the alert level. 

The third automation triggers actions (plays sounds/notifactions) based on whether the alertness is rising or falling.

### BrowserJukbi - 1. Jukbi Alerting
```
alias: BrowserJukbi - 1. Jukbi Alerting
description: ""
trigger:
  - platform: state
    entity_id:
      - sensor.browserjukbi_browserjukbiurl
condition:
  - condition: state
    entity_id: binary_sensor.countdown_timer
    state: "off"
action:
  - service: input_number.increment
    metadata: {}
    data: {}
    target:
      entity_id: input_number.browserjukbi_alert_level
    enabled: true
mode: single
```

### 'BrowserJukbi - 2. Jukbi Alertness Decay'
```
alias: BrowserJukbi - 2. Jukbi Alertness Decay
description: ""
trigger:
  - platform: time_pattern
    seconds: /30
    enabled: true
condition:
  - condition: state
    entity_id: binary_sensor.countdown_timer
    state: "off"
action:
  - service: input_number.set_value
    metadata: {}
    data:
      value: >-
        {{ states('input_number.browserjukbi_alert_level') | multiply(0.75) |
        int }}
    target:
      entity_id: input_number.browserjukbi_alert_level
mode: single
```
### 'BrowserJukbi - 3. Alert Level to Notification' 
```
alias: BrowserJukbi - 3. Alert Level to Notification
description: ""
trigger:
  - platform: state
    entity_id:
      - input_number.browserjukbi_alert_level
condition:
  - condition: state
    entity_id: binary_sensor.countdown_timer
    state: "off"
action:
  - if:
      - condition: numeric_state
        entity_id: input_number.browserjukbi_alert_level
        above: input_number.browserjukbi_previous_alert_level
        alias: If Alert Level is RISING
    then:
      - choose:
          - conditions:
              - condition: numeric_state
                entity_id: input_number.browserjukbi_alert_level
                above: 1.5
                below: 2.5
            sequence:
              - service: light.turn_on
                metadata: {}
                data:
                  rgb_color:
                    - 255
                    - 138
                    - 5
                target:
                  entity_id: light.black_reading_light

          - conditions:
              - condition: numeric_state
                entity_id: input_number.browserjukbi_alert_level
                above: 2.5
                below: 3.5
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
              - condition: numeric_state
                entity_id: input_number.browserjukbi_alert_level
                above: 3.5
                below: 4.5
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
              - condition: numeric_state
                entity_id: input_number.browserjukbi_alert_level
                above: 4.5
                below: 5.5
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
              - condition: numeric_state
                entity_id: input_number.browserjukbi_alert_level
                above: 5.5
                below: 6.5
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
              - condition: numeric_state
                entity_id: input_number.browserjukbi_alert_level
                above: 6.5
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

    else:
      - choose:
          - conditions:
              - condition: numeric_state
                entity_id: input_number.browserjukbi_alert_level
                below: 1
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

  - service: input_number.set_value
    metadata: {}
    data:
      value: "{{ states('input_number.browserjukbi_alert_level') }}"
    target:
      entity_id: input_number.browserjukbi_previous_alert_level
mode: single
```

Note: In the above example I've removed the 'play_media' actions, but you'd want to add a series of sounds in increasing harshness/alertness to represent the Jukbi's feedback.
