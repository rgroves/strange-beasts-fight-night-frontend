# Strange Beasts: Fight Night

This project was built when I was participating in the [Web Dev Challenge Hackathon S2.E2: Build a game played on at least 2 devices](https://codetv.dev/blog/web-dev-challenge-hackathon-s2e2-multi-device-game-temporal).

## Overview

Unleash your inner doodler in this wild, web-based arena where—with the help of your imagination, AI, and our virtual ring-side blow-by-blow commentator—**your doodles come to life**!

Sketch a one-of-a-kind beast, pump up its Power, Defense, and Speed scores, and pick its signature attack moves—then sit back and **listen** as the epic showdown unfolds in real time.

Is your mech-golem’s gravity hammer smash mighty enough to counter its challenger’s hurricane-scale wingbeat? Only the stats—and a bit of luck—will decide!

**Key Features**

- 🎨 **Creative Freedom:** Draw any beast you can imagine, from feathered wyverns to steam-powered scorpions.
- ⚔️ **Custom Stats & Attacks:** Assign ability scores and equip your beast with any attack you can imagine, from blazing plasma breath to reality-warping tentacle strikes.
- 🔊 **Immersive Commentary:** Hear every miss, glancing blow, and critical hit narrated with pulse-pounding flair.
- 🔄 **Endless Variety:** No two battles are the same!

Ready to turn your sketches into legendary fighters? Let the Strange Beasts: Fight Night begin!

## How it works:

1. **Create a Game (or Join In)** – connect with another challenger and ignite the arena!

1. **Draw** – unleash your creativity: sketch your strange beast however you like—from primal cave markings to elaborate illustrations—and add a brief description.

1. **Configure Your Beast** – dial in its Power, Defense, and Speed scores, then arm it with **any** attack types you can imagine.

1. **Tune In** – experience every thunderous strike and near miss in real time with pulse-pounding, blow-by-blow commentary!

## **Ready? Fight!**

Play here: _\[TODO: URL TBD]_

## Running Locally

### Backend Prerequisites

You'll need the backend components (Temporal Server, Temporal Worker, and BEFE Server) which can be found in this repo:
https://github.com/rgroves/strange-beasts-fight-night-backend

### Starting the App Locally

1. Ensure all backend components are running (see Backend Prerequisites)
1. You'll need to create a `.env` file at the root of your local repo with the appropriate vars set. See the `.env-example.txt` for details.
1. Start the app:
    ```
    npm run start
    ```
