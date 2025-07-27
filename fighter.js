// ==UserScript==
// @name         Fight Agent
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

        const currentHP = document.getElementById("combat-player-hitpoints-current-1");
        const maxHP = document.getElementById("combat-player-hitpoints-max-1");
        const healAmount = getHealAmount();

        if (currentHP && maxHP && healAmount !== null) {
            const current = parseInt(currentHP.textContent, 10);
            const max = parseInt(maxHP.textContent, 10);

            if ((max - current) >= healAmount) {
                const foodButton = document.getElementById('combat-footer-minibar-eat-btn');
                if (foodButton) {
                       foodButton.click();
                }
            }
        }
    }

    function lootUp() {
        const combat_box = document.getElementById("combat-loot");
        let loot_values = combat_box.querySelector('.text-left').textContent;
        //loot_values = loot_values.replace('<h5 class="font-size-sm font-w600 mb-0 w-100 text-left">', '');
        loot_values = loot_values.replace('Loot to Collect ( ', '');
        loot_values = loot_values.replace(' / 100 )', '');
        let loot_num = parseInt(loot_values);
        if (loot_num > 0) {
            const loot_btn = combat_box.querySelector('.btn.btn-sm.btn-success');
            if (loot_btn) {
                loot_btn.click();
            }
        }
    }

    function slayerTask() {
        let enemyName = document.getElementById("combat-enemy-name");
        if(enemyName != null) {
            enemyName = enemyName.innerHTML;
        }
        let slayerMenu = document.getElementById("combat-slayer-task-menu");
        let nextSlayerEnemy = slayerMenu.querySelector("div.font-w600").textContent;
        nextSlayerEnemy = nextSlayerEnemy.replace(/\d+/g, '');
        nextSlayerEnemy = nextSlayerEnemy.replace(' x ', '');
        if(enemyName != '-' && enemyName != nextSlayerEnemy) {
            let jumpToEnemyBtn = slayerMenu.querySelector("button.btn.btn-sm.btn-primary.mt-2");
            jumpToEnemyBtn.click();
        }
    }

    function main() {
        console.log("Fight Agent Starting");
        checkHealthGap();
        lootUp();
        slayerTask();

    }
    setInterval(main, 2000);
})();
