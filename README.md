Final Tech Challenge: “Earn & Collect” — A Reward System for IRL Interactions

Concept:
Build a prototype of a web-based reward experience where users unlock digital tokens (or rewards) by completing real-world tasks. The goal is to simulate a simple system where physical actions—like checking in at a location, watching content, or scanning a code—are tracked and rewarded. The user’s earned rewards are stored in a lightweight “wallet” view.

Core Features

1. User Actions (Simulated or Real)
   Implement up to 3 different types of reward-triggering actions:
   Location Check-in – Triggered if the user is within X meters of a hardcoded location (e.g., a venue).
   Watch a Video – User must watch at least 15 seconds of an embedded video to unlock the reward.
   Scan a Code – Simulate QR scanning or allow pasting a code into a field.

Each action unlocks a different type of reward token (e.g., “Check-In Coin”, “Hype Badge”, etc.).

2. Wallet View
   Display all rewards earned so far.
   Include basic metadata like:
   Time earned
   How it was earned
   Token icon or image
   Optional animation when new rewards are added.

3. Persistent State
   Use local storage (or similar) to keep the wallet persistent across sessions.
   Allow users to receive multiples of the same reward
   Allow the user to reset their wallet.

Bonus
Add a cooldown (e.g., “You already checked in here today!”).
Let the user customize their wallet with a name/avatar.
Add basic sound or animation feedback when rewards are earned.
Optional progress bar or “collect X to unlock Y” type logic.
Mock API usage for saving rewards (simulated backend).
Use AI to generate a custom name/icon for each reward.

Evaluation Criteria
This challenge touches on:
Frontend architecture and component design
Use of browser APIs (e.g. geolocation, media, storage)
UX for real-world companion tools
Creativity and reward mechanics
Optional AI/automation use
Technical cleanliness and code organization

Submission Instructions
Please submit:
A link to the hosted demo (GitHub Pages/Vercel/Netlify, etc.)
Source code (GitHub or ZIP)
A short README including:
Tech stack used
Description of how each interaction was implemented
AI tools used (if any)
