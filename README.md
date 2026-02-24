# _technical_01 AI Website

This is a comprehensive, hacker-themed portfolio website for **Aman Meena** (_technical_01), created by **Amit Meena**.

## Features

*   **Hacker Aesthetic:** Matrix rain effect, dark theme, and terminal-like interface.
*   **AI Chatbot:** An integrated AI assistant powered by Hugging Face's Qwen2.5-7B-Instruct model.
*   **Bluetooth Simulator:** A simulated Bluetooth signal scanner (visual effect only).
*   **System Scan:** Simulated "hacking" commands like `track me`, `system scan` (safe IP reveal).
*   **Responsive Design:** Works on desktop and mobile.

## Setup Instructions

To use the AI chatbot feature, you must provide your own Hugging Face API key.

1.  Open the `script.js` file.
2.  Locate the line:
    ```javascript
    const API_KEY = "YOUR_HUGGING_FACE_API_KEY"; // TODO: Replace with your actual key
    ```
3.  Replace `YOUR_HUGGING_FACE_API_KEY` with your actual key.
    *   Example: `const API_KEY = "hf_xxxxxxxxxxxxxxxxxxxxxxxx";`

## Usage

*   **Home:** Overview and chatbot interface.
*   **About Me:** Information about Aman Meena.
*   **Contact Us:** Contact form and social links.
*   **Privacy Policy:** Site policies.
*   **Hacker Mode:** Click the "Hacker Mode" button in the top right to toggle the visual effects.

## Security Note

This project is a static website. API keys placed in `script.js` are visible to anyone who views the source code. Do not use production keys with sensitive access or billing on a public deployment.
