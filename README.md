# Shape Collector

This is a modern web application built with React, Vite, TypeScript, PIXI.js, MobX, and GSAP. It is intended for collecting and interacting with various shapes using performant rendering and smooth animations.

## 🛠️ Technologies Used

- **React 19**
- **Vite** for development/build
- **TypeScript**
- **PIXI.js** for rendering graphics
- **GSAP** for animations
- **MobX** for state management
- **ESLint** for code linting

## 📦 Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build the project for production
- `npm run lint` — Run ESLint to check code quality
- `npm run preview` — Preview the built project locally

## 📁 Project Setup

To get started:

```bash
npm install
npm run dev
```

# About

> **Important !!!:**
> - I noticed that from time to time, after pressing the start button, nothing happens, probably due to the attachment of shapes and text to the `this.app.stage`. I haven't allocated time to investigate this issue. If you encounter the same problem, a refresh should resolve the situation.
> - The app was developed using **Chrome**. Please use this browser to test, I know that Mozilla is more restrictive when working with WebGL. This error might happen: WebGL context was lost.

This project implements some of the main requirements of the task. The focus was on developing the architecture and making a functional game.

### Features
- The user can select a **difficulty** level to play the game. Based on the selected difficulty, two key factors of the game are adjusted:
    - **Timer** duration per round/level.
    - **Variety of shapes**.
    - **Penalty points**

- Once the user clicks **"Start Game"**:
    - The button will disappear and be replaced by a timer.
    - The timer resets every round/level based on the selected difficulty.
    - A **countdown animation** is displayed, giving the user time to prepare before the first round begins.

- Each game has **3 levels** with the following number of distractors:
    - Level 1: 7 distractors.
    - Level 2: 4 distractors.
    - Level 3: 0 distractors.
- After winning a level, a message - *You win* - will appear and the new round will begin immediately after its animation will complete.

### Differences from the Task Requirements
Due to time constraints, some features were not implemented or simplified:
- **Point System**:
  The user gains points for each correct shape clicked and lose when clicked on distractors, but the game will not be over if Score reaches 0.
- **Game Over**:
  When the timer runs out, the game is lost. If the user wants to play again, they should go back to the main menu to select a new difficulty.
- **No Leaderboard**:
  Features like ranking players were not implemented.
- **No "Save & Reset"**:
  The game does not include options to save progress or reset the gameplay state.
- **Limited Animations**:
  Basic animations, such as for the countdown at the start and win/lose text after a round, were included but nothing more 'fancy'. 

# Architecture

## React Components
- **`App` Component**:
  Represents the main menu page.
- **`Game` Component**:
  A child of the `App` component. This handles all the logic of the game.
- **`Canvas` Component**:
  A child of the `Game` component. This handles the display of the pixi stage.
- **`Timer` Component**:
  A child of the `Game` component. This handles logic related to the timer, such as starting it, resetting it, and executing the `callbackOnTimeout` functionality.

## Classes for handling Pixi logic
- **`Engine` Class**:
  This is the main class, designed using the **singleton** and **facade** patterns. It ensures that there is one central pixi app running.
    - Can be accessed in any React class by importing it and calling methods such as `Engine.instance.doSth()`.
    - Responsibilities:
        - Initializing the pixi application.
        - Creating objects.
        - Managing animations.
        - Performing clean-up.

    - This separation helps keep the React logic independent from the pixi logic.

- **`Factory` Class**:
  Implements the **factory** pattern.
    - Dynamically creates shapes based on input parameters, such as **shape** and **color**.

### Explanation of Patterns Used
- **Singleton Pattern**:
  Ensures that there is only one instance of the `Engine` class throughout the application, providing a centralized and consistent way to access and manipulate the pixi logic.
- **Facade Pattern**:
  Simplifies interaction with pixi app by providing an interface through the `Engine` class.
- **Factory Pattern**:
  Provides a way to dynamically create and manage different shape objects.

## Util methods and constants
- **`getRandomShape`**:
  Generates the main shape with a random **shape** and **color**. The available color options are based on the selected difficulty.
- **`generateShapeColorPairs`**:
  Generates **10 random shapes** based on the main shape and the selected difficulty.

![Alt text](/public/Diagram.png "Optional Tooltip")

## Notes 
The most challenging part of this assignment was working with React, as I hadn’t used it for the past two years.
### What I would change if I wanted to spend more time:
- Implement all the requirements, including the **optional ones**.
- Further refine the **Pixi architecture** - as example - splitting the `Engine` logic into two separated classes `Engine` and `Facade`.
- Define all **magic numbers** and **strings** as constants in a dedicated file.
- Improve the React components. The **Game** component is quite big and takes care of much logic - using custom hooks would've been a way of improving. 
- I don't use any state management tool like Context or Redux but for a real game it's a must. Using only parent-child communication is not a good idea.