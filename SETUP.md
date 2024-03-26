# Setup

## Architecture

This current setup is particular to my home office network. Ingredients include:

- BrowserJukbi Chrome Extension - gathering the domain data of each page, broadcasting messages over MQTT  
- BRAINS: Home Assistant, running on a home server
- MQTT Broker: Eclipse-mosquitto MQTT broker, running on a home server
- SOUND: RPi running VLC listening to telnet as a daemon, plugged into my sound system, integrated into Home Assistant
- LIGHTS: A Philips Hue system with hub, integrated into Home Assistant
- DATA: a DLNA Home Media server serving files, running on a home server, integrated into Home Assitant

In theory, all of this could be integrated into a single package with an RPI with speaker / line out and a bulb.

- 

## Extension Setup

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

## Home Assistant Setup

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
  - alias: Rising/Falling sounds
    if:
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
              - service: media_player.play_media
                target:
                  entity_id: media_player.vlc_telnet
                data:
                  media_content_id: media-source://dlna_dms/MEDIASERVER/:22$@5
                  media_content_type: audio/wav
                metadata:
                  title: dry_ding
                  thumbnail: null
                  media_class: music
                  children_media_class: null
                  navigateIds:
                    - {}
                    - media_content_type: app
                      media_content_id: media-source://dlna_dms
                    - media_content_type: object.container
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:21
                    - media_content_type: object.container.storageFolder
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:22
                    - media_content_type: object.container.storageFolder
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:22$203
          - conditions:
              - condition: numeric_state
                entity_id: input_number.browserjukbi_alert_level
                above: 2.5
                below: 3.5
            sequence:
              - service: media_player.play_media
                target:
                  entity_id: media_player.vlc_telnet
                data:
                  media_content_id: media-source://dlna_dms/MEDIASERVER/:22$@10
                  media_content_type: audio/wav
                metadata:
                  title: sharp_gong
                  thumbnail: null
                  media_class: music
                  children_media_class: null
                  navigateIds:
                    - {}
                    - media_content_type: app
                      media_content_id: media-source://dlna_dms
                    - media_content_type: object.container
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:21
                    - media_content_type: object.container.storageFolder
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:22
                    - media_content_type: object.container.storageFolder
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:22$203
          - conditions:
              - condition: numeric_state
                entity_id: input_number.browserjukbi_alert_level
                above: 3.5
                below: 4.5
            sequence:
              - service: media_player.play_media
                target:
                  entity_id: media_player.vlc_telnet
                data:
                  media_content_id: media-source://dlna_dms/MEDIASERVER/:22$@6
                  media_content_type: audio/wav
                metadata:
                  title: bowl_4_knocks
                  thumbnail: null
                  media_class: music
                  children_media_class: null
                  navigateIds:
                    - {}
                    - media_content_type: app
                      media_content_id: media-source://dlna_dms
                    - media_content_type: object.container
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:21
                    - media_content_type: object.container.storageFolder
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:22
                    - media_content_type: object.container.storageFolder
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:22$203
          - conditions:
              - condition: numeric_state
                entity_id: input_number.browserjukbi_alert_level
                above: 4.5
                below: 5.5
            sequence:
              - service: media_player.play_media
                target:
                  entity_id: media_player.vlc_telnet
                data:
                  media_content_id: media-source://dlna_dms/MEDIASERVER/:22$@9
                  media_content_type: audio/wav
                metadata:
                  title: bowl_7_knocks
                  thumbnail: null
                  media_class: music
                  children_media_class: null
                  navigateIds:
                    - {}
                    - media_content_type: app
                      media_content_id: media-source://dlna_dms
                    - media_content_type: object.container
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:21
                    - media_content_type: object.container.storageFolder
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:22
                    - media_content_type: object.container.storageFolder
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:22$203
          - conditions:
              - condition: numeric_state
                entity_id: input_number.browserjukbi_alert_level
                above: 5.5
                below: 6.5
            sequence:
              - service: media_player.play_media
                target:
                  entity_id: media_player.vlc_telnet
                data:
                  media_content_id: media-source://dlna_dms/MEDIASERVER/:22$@8
                  media_content_type: audio/wav
                metadata:
                  title: bowl_many
                  thumbnail: null
                  media_class: music
                  children_media_class: null
                  navigateIds:
                    - {}
                    - media_content_type: app
                      media_content_id: media-source://dlna_dms
                    - media_content_type: object.container
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:21
                    - media_content_type: object.container.storageFolder
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:22
                    - media_content_type: object.container.storageFolder
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:22$203
          - conditions:
              - condition: numeric_state
                entity_id: input_number.browserjukbi_alert_level
                above: 6.5
            sequence:
              - service: media_player.play_media
                target:
                  entity_id: media_player.vlc_telnet
                data:
                  media_content_id: media-source://dlna_dms/MEDIASERVER/:22$@7
                  media_content_type: audio/wav
                metadata:
                  title: warning_alarms
                  thumbnail: null
                  media_class: music
                  children_media_class: null
                  navigateIds:
                    - {}
                    - media_content_type: app
                      media_content_id: media-source://dlna_dms
                    - media_content_type: object.container
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:21
                    - media_content_type: object.container.storageFolder
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:22
                    - media_content_type: object.container.storageFolder
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:22$203
    else:
      - choose:
          - conditions:
              - condition: numeric_state
                entity_id: input_number.browserjukbi_alert_level
                below: 1
            sequence:
              - service: media_player.play_media
                target:
                  entity_id: media_player.vlc_telnet
                data:
                  media_content_id: media-source://dlna_dms/MEDIASERVER/:22$@4
                  media_content_type: audio/x-aiff
                metadata:
                  title: soft_gong
                  thumbnail: null
                  media_class: music
                  children_media_class: null
                  navigateIds:
                    - {}
                    - media_content_type: app
                      media_content_id: media-source://dlna_dms
                    - media_content_type: object.container
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:21
                    - media_content_type: object.container.storageFolder
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:22
                    - media_content_type: object.container.storageFolder
                      media_content_id: media-source://dlna_dms/MEDIASERVER/:22$203
  - alias: Lights only
    choose:
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
      - conditions:
          - condition: numeric_state
            entity_id: input_number.browserjukbi_alert_level
            above: 0.5
            below: 1.5
        sequence:
          - service: light.turn_on
            metadata: {}
            data:
              rgb_color:
                - 148
                - 253
                - 78
            target:
              entity_id: light.black_reading_light
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
                - 200
                - 0
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
                - 255
                - 123
                - 0
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
                - 255
                - 102
                - 0
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
                - 255
                - 38
                - 0
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
                - 255
                - 0
                - 149
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
                - 255
                - 0
                - 221
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

