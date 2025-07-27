// ==UserScript==
// @name         Thief Agent
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Alerts when health is low enough to use food
// @match        https://melvoridle.com/index_game.php
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    function getHealAmount() {
        const foodButton = document.querySelector("food-select-option");
        if (!foodButton) return null;
        const spans = foodButton.querySelectorAll("span");

        for (let span of spans) {
            const match = span.textContent.match(/\+(\d+)\s*HP/i);
            if (match) {
                return parseInt(match[1], 10);
            }
        }

        return null;
    }

    function checkHealthGap() {

        const currentHP = document.getElementById("thieving-player-hitpoints-current");
        const maxHP = document.getElementById("thieving-player-hitpoints-max");
        const healAmount = getHealAmount();

        if (currentHP && maxHP && healAmount !== null) {
            const current = parseInt(currentHP.textContent, 10);
            const max = parseInt(maxHP.textContent, 10);

            if ((max - current) >= healAmount) {
                const thieving_food = document.getElementById('thieving-food-select')
                //const foodButton = document.getElementById('combat-footer-minibar-eat-btn');
                const foodButton = thieving_food.querySelector('.btn.btn-outline-secondary');
                if (foodButton) {
                       foodButton.click();
                }
            }
        }
    }

    function main() {
        //console.log("Thief Agent Starting");
        checkHealthGap();
    }
    setInterval(main, 2000);
})();
