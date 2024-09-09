# HCDSB D2L Theme Selector

## Description

This Tampermonkey script adds a customizable theme selector to the HCDSB D2L (Desire2Learn) platform. It allows users to switch between predefined themes, create custom themes, and easily toggle the theme menu visibility.

## Features

- Draggable theme selector menu
- Predefined themes (Default, Dark, Neon, Pastel)
- Custom theme creation
- Foldable menu to save screen space
- Persistent custom themes across sessions

## Installation

1. Install the Tampermonkey browser extension:
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. Click on the Tampermonkey icon in your browser and select "Create a new script"

3. Delete any existing code in the editor

4. Copy and paste the entire script from the `hcdsb_d2l_theme_selector.js` file in this repository

5. Click File -> Save or press Ctrl+S to save the script

## Usage

1. Navigate to the HCDSB D2L website (https://hcdsb.elearningontario.ca/d2l/)

2. You should see a "Themes" menu in the top-right corner of the page

3. Click on a theme name to apply it

4. To create a custom theme:
   - Enter a name for your theme
   - Select colors for background, navigation, and text
   - Click "Add Theme"

5. To fold/unfold the menu, click the "×" or "≡" button in the top-right corner of the menu

6. You can drag the menu by clicking and holding the top bar

## Customization

You can modify the predefined themes or add new ones by editing the `themes` object at the beginning of the script.

## Disclaimer

This script is not officially associated with HCDSB or D2L. Use at your own risk.
