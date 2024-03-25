# Browser Jukbi

Browser Jukbi alerts you back to a state of focus on the Internet.

![jukbi.jpeg](jukbi.jpeg)

The _jukbi_ is also known as the Seon stick, Awakening stick, Keisaku, xiāng bǎn, or [kyōsaku](https://en.wikipedia.org/wiki/Keisaku_).

# Trying to walk through the Internet

_The rhythm of walking generates a kind of rhythm of thinking, and the passage through a landscape echoes or stimulates the passage through a series of thoughts. This creates an odd consonance between internal and external passage, one that suggests that the mind is also a landscape of sorts and that walking is one way to traverse it. A new thought often seems like a feature of the landscape that was there all along, as though thinking were traveling rather than making. And so one aspect of the history of walking is the history of thinking made concrete—for the motions of the mind cannot be traced, but those of the feet can._

-- Rebecca Solnit, from _Wanderlust: A History of Walking_

I love walking. While walking is specifically a kinaaesthetic activity, a somatic practice, there is much to be learned from the tempo it allows. _The rhythm of walking generates a kind of rhythm of thinking._ 

On the Internet, I have noticed that I can flit from place to place -- link to link, page to page, tab to tab. Am I ever settling in, sitting here in the landscape with meaning? Or am I hummingbird, wings beating so fast you can't see them, darting from spot to spot, ocasionally unmoving but never quite _still_?

I would like to walk more slowly through the Internet, so that I might attend more deeply to things.

If we conceptualize each 'place on the internet' as being bounded by a domain name, then walking slowly within each place might mean walking more slowly in each domain name. What is a spacious amount of time to spend in one domain, before stepping into another? 5 seconds? 10 seconds? 1 minute? 5 minutes?

What would an internet be, if movements from domain to domain happened every 5 minutes?



# What it does

BrowserJukbi is made out of a Chrome extension + Home Assistant integration.
A Chrome extension sends domains to Home Assistant upon URL/tab change.
A series of Home Assistant Helpers and automations change a light and play sounds of warning when you're browsing too rapidly.


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
