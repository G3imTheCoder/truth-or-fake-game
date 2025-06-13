# Truth or Fake? - Technical Test for Base for Music

This project is an interactive mini-game developed as a technical test for Base for Music. The game challenges the player to distinguish between real "life advice" fetched from a public API and fake advice generated locally.

## Technologies Used

*React:** A JavaScript library for building user interfaces.
**TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and developer experience.
**Mantine:** A comprehensive React components library with a focus on usability, accessibility, and customization.
**Advice Slip JSON API:** A public API (`https://api.adviceslip.com/advice`) used to fetch authentic advice.

## Game Rules

  The player starts with 10 points.
  The game begins with a "Start Game" button. Once clicked, the first piece of advice is displayed.
  In each round, a piece of advice is displayed. This advice is either real (from the API) or fake (from a local list), chosen randomly.
  The player must guess if the advice is "True Advice" or "Fake Advice".
  **Scoring:** Correct guess: +1 point.  * Incorrect guess: -1 point.
  **Win Condition:** Reach 20 points.
  **Lose Condition:** Score drops to 0 points.
  A "Play Again" button appears when the game ends.

## Installation and Launch Instructions

To set up and run the project locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/G3imTheCoder/truth-or-fake-game.git
    cd truth-or-fake-game
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

    This command will install all the necessary React, TypeScript, and Mantine packages, including `@mantine/notifications`.

3. **Start the development server:**

    ```bash
    npm start
    ```

    This will open the application in your default web browser at `http://localhost:3000`.

## Technical Architecture

The application is structured as a single-page application (SPA) using React.

* **`src/App.tsx`:** This is the main component of the application. It manages the core game logic and state:
  * `score`: Tracks the player's current score.
  * `currentAdvice`: Stores the advice displayed in the current round.
  * `isTrueAdvice`: A boolean indicating if `currentAdvice` is genuine or fake.
  * `gameOver`, `gameResult`: Control the game's end state and display messages.
  * `gameStarted`: Controls the visibility of the initial "Start Game" screen.
  * `isLoadingAdvice`: Controls the display of a loading indicator during API calls.
  * **Functions:**
    * `fetchRealAdvice`: An asynchronous function (`useCallback` memoized) responsible for making API calls to `https://api.adviceslip.com/advice`. It includes a timestamp parameter to ensure fresh advice is fetched each time and handles potential API errors with a fallback.
    * `fetchAndDisplayNextAdvice`: An asynchronous function (`useCallback` memoized) that randomly decides whether to fetch real or fake advice, updates the `currentAdvice` and `isTrueAdvice` states, and manages the `isLoadingAdvice` state.
    * `startGame`: Initializes a new game (resets score, clears results, sets game started) and then calls `fetchAndDisplayNextAdvice` to load the first advice.
    * `handleGuess`: Processes the player's guess, updates the `score`, and checks for win/loss conditions. It then triggers `fetchAndDisplayNextAdvice` for the next round or sets the game to over.
    * `resetGame`: Resets all game-related states by calling `startGame` to begin a new game.
  * **Hooks:** `useState` is used for managing component-specific state. `useCallback` is used to memoize functions (`fetchRealAdvice`, `fetchAndDisplayNextAdvice`, `startGame`, `handleGuess`, `resetGame`) for performance optimization and to prevent unnecessary re-renders, adhering to React Hooks best practices.
* **`src/index.tsx`:** The entry point of the React application. It wraps the `App` component with `MantineProvider` to enable Mantine UI components and ensures Mantine's base styles (`@mantine/core/styles.css`) are imported.
* **`src/fakeAdvice.json`:** A local JSON file containing an array of handcrafted fake advice messages in English, fulfilling the project's data requirements. It's imported into `App.tsx` and used as a source for fake advice.

## Implemented Bonus Features

As requested in the test, I have implemented the following bonus features to enhance the user experience:

* **UX Feedback (Notifications):** Implemented Mantine's `notifications` to provide immediate, clear visual feedback to the user after each guess (Correct/Incorrect) and upon winning or losing the game. An error notification is also displayed if the API call fails.
* **Loading Indicator:** A `Loader` component from Mantine is displayed while `fetchRealAdvice` is in progress, providing a clear visual cue to the user that advice is being fetched.
* **Replay Button:** A "Play Again" button is displayed at the end of the game (win or lose) to easily restart.
* **Display Game History:** At the end of the game (win or lose), a history of all advice presented during that game session is displayed below the final result. Each entry in the history clearly shows:
  * The advice text itself.
  * Whether the advice was actually **TRUE** or **FAKE**.
  * Whether the player's guess for that advice was **Correct** or **Incorrect**.
  This section is scrollable to accommodate longer games, ensuring all past advice can be reviewed.

1.**Further UX Enhancements:** While immediate notifications and a loading indicator are integrated, additional animations (e.g., for score changes, game transitions) could further enhance the dynamic feel of the application.
2.**Theming:** Explore Mantine's comprehensive theming capabilities to introduce a custom color palette or dark mode toggle for a more polished look and feel.
3.**Responsiveness:** Further refine the layout and styling for optimal display across various screen sizes (mobile, tablet, desktop).
