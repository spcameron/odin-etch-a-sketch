# Etch-a-Sketch

This is the fourth project in TOP. The goal of the project is to build a browser based etch-a-sketch or sketchpad that employs recent lessons in DOM manipulation and flexbox layout. Draw, erase, shade, and lighten pixels on a customizable grid with the ability to choose any brush color. By revisiting and extending this project, I learned so much about structuring larger projects and implementing features iteratively.

## Features
- Grid based canvas (2x2 to 64x64)
- Draw mode, with the ability to choose any color
- Erase, shade, and lighten modes
- Toggle show/hide gridlines
- Click or drag to apply tools
- Responsive layout and retro styling

## Project Evolution

The first iteration of the project represented the most basic requirements of the project scope. A draw screen of fixed dimensions is centered in the browser window and initially drawn with a 16x16 grid of squares. By hovering the mouse over a square within the draw screen, the background color of the square changes to represent a "filled in" square, and that color persists as the mouse moves out of the square. A button above this draw screen is also rendered, and by clicking on this button, the user can clear the draw screen and resize it with smaller or larger squares.

When revisiting this project, I hoped to add many features to make it feel more robust and engaging to the user. I replaced the prompt() with in-page input, added tools for erase, shade, and lighten, and added the ability to choose colors. The page was styled to suggest a retro Ironman color scheme and a central container suggestive of the classic Etch-a-Sketch toy.

## File Overview
- index.html - Structure and UI layout
- styles.css - Theme, layout, and interaction styles
- scripts.js - Grid logic, tool handling, RGB/HSL conversion utilities, and input events