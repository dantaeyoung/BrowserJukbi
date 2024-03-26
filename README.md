# Browser Jukbi

Browser Jukbi alerts you back to a state of focus on the Internet.

![jukbi.jpeg](jukbi.jpeg)

(The _jukbi_ is also known as the Seon stick, Awakening stick, kyōsaku, xiāng bǎn, or [keisaku](https://en.wikipedia.org/wiki/Keisaku_).)

# Trying to walk through the Internet

_The rhythm of walking generates a kind of rhythm of thinking, and the passage through a landscape echoes or stimulates the passage through a series of thoughts. This creates an odd consonance between internal and external passage, one that suggests that the mind is also a landscape of sorts and that walking is one way to traverse it. A new thought often seems like a feature of the landscape that was there all along, as though thinking were traveling rather than making. And so one aspect of the history of walking is the history of thinking made concrete—for the motions of the mind cannot be traced, but those of the feet can._

-- Rebecca Solnit, from _Wanderlust: A History of Walking_

I love walking. While walking is specifically a kinaaesthetic activity, a somatic practice, there is much to be learned from the tempo it allows. _The rhythm of walking generates a kind of rhythm of thinking._ 

On the Internet, I have noticed that I can flit from place to place -- link to link, page to page, tab to tab. Am I ever settling in, sitting here in the landscape with meaning? Or am I hummingbird, wings beating so fast you can't see them, darting from spot to spot, ocasionally unmoving but never quite _still_?

I would like to walk more slowly through the Internet, so that I might attend more deeply to things.

If we conceptualize each 'place on the internet' as being bounded by a domain name, then walking slowly within each place might mean walking more slowly in each domain name. What is a spacious amount of time to spend in one domain, before stepping into another? 5 seconds? 10 seconds? 1 minute? 5 minutes?

What kind of _rhythm of thinking_ would be allowed through a slower rhythm of movement through the Internet?

# Browser죽비/Jukbi

BrowserJukbi is an system that notifies me when I am moving from domain to domain too quickly on my browser, inspired by the idea of the 죽비 Jukbi, a bamboo stick that is used by Buddhist teachers to (gently) strike their students and startle them back into a state of focus.

When I browse between domains too quickly, the Jukbi's alertness increases. As its alertness goes higher, my environmeht changes -- a sound starts to notify me with a rasping bell, my lights turn redder, a series of increasingly alerting gongs play, and finally, an error sound. Over time, if I stay at one domain, its alertness settles back to relaxation.

By translating the pace of my Internet movement to the acoustic domain, the hopes are to create a sensorial understanding of movement, and encourage a slow movement on the internet.

# Observations

Currently, I have the settings set to stay on each domain, at least 30 seconds at a time.

It turns out that this pace feels surprisingly slow, at least for me. Searching for something on the internet involves a jump to a search engine, then a page, then back to the search engine, repeated a few times. This could involve jumping around five, ten, twenty domains within the span of a minute.

Interestingly, some unexpected strategies have emerged. I have started to keep multiple browser windows already open to specific sites, Because only browser URL changes & tab changes are noticed by BrowserJukbi. Moving between the internet has become moving between windows on my screen. Somehow, this feels more apt; changing windows is more congruent to the mental context-switching that is already necessary to shift between domains.


# How it works

BrowserJukbi is made out of a Chrome extension + Home Assistant integration.
A Chrome extension sends domains to Home Assistant upon URL/tab change.
A series of Home Assistant Helpers and automations change a light and play sounds of warning when you're browsing too rapidly.

For detailed information, please visit [SETUP.md](SETUP.md).
