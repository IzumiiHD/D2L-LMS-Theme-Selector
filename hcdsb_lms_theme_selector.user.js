// ==UserScript==
// @name         Enhanced Theme Selector for HCDSB D2L
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Adds a foldable, draggable theme selector menu for HCDSB D2L with custom themes
// @match        https://hcdsb.elearningontario.ca/d2l/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // Define default themes
    let themes = {
        'Default': { bg: '#fff', nav: '#006fbf', text: '#202122' },
        'Dark': { bg: '#2a2a2a', nav: '#1a1a1a', text: '#ffffff' },
        'Neon': { bg: '#0f0f23', nav: '#ff00ff', text: '#00ff00' },
        'Pastel': { bg: '#f0e6ff', nav: '#b19cd9', text: '#4a4a4a' }
    };

    // Load custom themes from storage
    const customThemes = GM_getValue('customThemes', {});
    themes = { ...themes, ...customThemes };

    // Create menu HTML
    const menuHTML = `
        <div id="theme-selector">
            <div id="theme-handle">≡ Themes <button id="fold-button">×</button></div>
            <div id="theme-menu">
                <div id="theme-list"></div>
                <div id="custom-theme-form">
                    <input type="text" id="custom-theme-name" placeholder="Theme Name">
                    <input type="color" id="custom-bg-color" title="Background Color">
                    <input type="color" id="custom-nav-color" title="Navigation Color">
                    <input type="color" id="custom-text-color" title="Text Color">
                    <button id="add-custom-theme">Add Theme</button>
                </div>
            </div>
        </div>
    `;

    // Add styles
    GM_addStyle(`
        #theme-selector {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
            transition: all 0.3s;
            width: 200px;
        }
        #theme-handle {
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            cursor: move;
            border-radius: 8px 8px 0 0;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #fold-button {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
        }
        #theme-menu {
            padding: 10px;
            max-height: 300px;
            overflow-y: auto;
        }
        .theme-option {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 8px;
            margin: 5px 0;
            border: none;
            background-color: #f0f0f0;
            cursor: pointer;
            transition: background-color 0.3s;
            border-radius: 4px;
        }
        .theme-option:hover {
            background-color: #e0e0e0;
        }
        .color-preview {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 10px;
            border: 1px solid #ccc;
        }
        #custom-theme-form {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
        }
        #custom-theme-form input {
            margin-bottom: 5px;
            padding: 5px;
        }
        #add-custom-theme {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 8px;
            cursor: pointer;
            border-radius: 4px;
        }
        #theme-selector.folded {
            width: auto;
            height: auto;
        }
        #theme-selector.folded #theme-menu {
            display: none;
        }
    `);

    // Function to change theme
    function changeTheme(theme) {
        const { bg, nav, text } = themes[theme];
        const elements = document.querySelectorAll('body, #d2l_body, .d2l_body, .d2l-body');
        elements.forEach(element => {
            element.style.backgroundColor = bg;
            element.style.color = text;
        });

        const navElements = document.querySelectorAll('.d2l-branding-navigation-background-color, .d2l-navigation-s');
        navElements.forEach(element => {
            element.style.backgroundColor = nav;
        });

        // Additional selectors for text color
        const textElements = document.querySelectorAll('body, #d2l_body, .d2l_body, .d2l-body, .d2l-widget-header');
        textElements.forEach(element => {
            element.style.color = text;
        });

        // Adjust link colors
        const linkElements = document.querySelectorAll('a');
        linkElements.forEach(element => {
            element.style.color = theme === 'Dark' ? '#4da6ff' : '#006fbf';
        });
    }

    // Function to render theme list
    function renderThemeList() {
        const themeList = document.getElementById('theme-list');
        themeList.innerHTML = Object.keys(themes).map(theme => `
            <button class="theme-option" data-theme="${theme}">
                <span class="color-preview" style="background-color: ${themes[theme].bg};"></span>
                ${theme}
            </button>
        `).join('');

        // Add event listeners to theme options
        document.querySelectorAll('.theme-option').forEach(button => {
            button.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                changeTheme(theme);
            });
        });
    }

    // Add menu to page
    document.body.insertAdjacentHTML('beforeend', menuHTML);
    renderThemeList();

    // Make the menu draggable
    const themeSelector = document.getElementById('theme-selector');
    const themeHandle = document.getElementById('theme-handle');

    let isDragging = false;
    let startX, startY, startLeft, startTop;

    themeHandle.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
        if (e.target.id === 'fold-button') return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = themeSelector.offsetLeft;
        startTop = themeSelector.offsetTop;
        themeSelector.style.opacity = '0.8';
    }

    function drag(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        themeSelector.style.left = `${startLeft + dx}px`;
        themeSelector.style.top = `${startTop + dy}px`;
    }

    function stopDragging() {
        isDragging = false;
        themeSelector.style.opacity = '1';
    }

    // Add custom theme functionality
    document.getElementById('add-custom-theme').addEventListener('click', function() {
        const name = document.getElementById('custom-theme-name').value;
        const bg = document.getElementById('custom-bg-color').value;
        const nav = document.getElementById('custom-nav-color').value;
        const text = document.getElementById('custom-text-color').value;

        if (name && bg && nav && text) {
            themes[name] = { bg, nav, text };
            GM_setValue('customThemes', { ...customThemes, [name]: { bg, nav, text } });
            renderThemeList();
            changeTheme(name);
        } else {
            alert('Please fill in all fields for the custom theme.');
        }
    });

    // Fold/unfold functionality
    const foldButton = document.getElementById('fold-button');
    foldButton.addEventListener('click', function() {
        themeSelector.classList.toggle('folded');
        foldButton.textContent = themeSelector.classList.contains('folded') ? '≡' : '×';
    });

    // Initial theme application
    changeTheme('Default');
})();
