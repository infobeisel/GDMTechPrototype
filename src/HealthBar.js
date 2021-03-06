import * as PIXI from 'pixi.js'
import { textStyle, getRoundedRectangle, getIntLength } from "./lib/PixiUtilMethods";

export default class HealthBar {
    constructor(app) {
    	this.app = app;
    }

    prepareObject(x_pos, y_pos, width, height, barColorCode, textColorCode, maxHealth) {
        //green: 0x4CBB17; red: 0xFF3300
        // create the health bar
        this.container = new PIXI.Container();

        // health properties
        this.container.maxHealth = maxHealth;
        this.container.currHealth = maxHealth;

        // healthbar global position
        this.container.x = x_pos;
        this.container.y = y_pos;
        this.container.name = "healthbar";
        this.container._zIndex = Number.MAX_SAFE_INTEGER-1;

        // create the max-health rectangle
        let innerBar = getRoundedRectangle(-width/2, 0, width, height, 4, 0x000000);
        this.container.addChild(innerBar);
        this.container.innerBar = innerBar;

        // create the current-health rectangle with an outline effect
        let diffValue = width/32;
        let outerBar = getRoundedRectangle(-width/2 + diffValue/2, diffValue/2, width - diffValue,
            height - diffValue, 4, barColorCode);
        this.container.addChild(outerBar);
        this.container.outerBar = outerBar;

        this.container.valueText = new PIXI.Text(maxHealth, textStyle("Comic Sans MS", 14, 
            "center", ["#ffffff"], "#000000", 2));

        this.calculateHealthTextX();
        this.container.valueText.y = -18;
        this.container.valueText.style.fill = textColorCode;
        this.container.valueText.resolution = 2;
        
        this.container.addChild(this.container.valueText);

        this.changedBar = false;
    }

    initObject() {
        this.app.stage.addChild(this.container);
    }

    calculateHealthTextX() {
        let healthText = "" + this.container.currHealth;
        this.container.valueText.x = -5*healthText.length;
    }

    subtractHealth(value) {
        if (this.container.currHealth - value > 0) {
            let maxWidth = this.container.innerBar.width;
            let maxHealth = this.container.maxHealth;
            let ratio = maxWidth/maxHealth;
            let diffValue = maxWidth/32;
            this.container.currHealth -= value;
            this.container.outerBar.width -= value*ratio;
        }
        else {
            this.container.currHealth = 0;
            this.container.outerBar.width = 0;
            this.app.statistics.playerDied();
        }
        this.calculateHealthTextX();
        this.container.valueText.text = this.container.currHealth;
    }

    isChanged() {
        return this.changedBar;
    }

    changeTextColor(colorcode) {
        this.container.valueText.style.fill = colorcode;
    }

    changeBarColor(colorcode) {
        let oldOutterBar = this.container.outerBar;
        let outerBar = getRoundedRectangle(
            oldOutterBar.x - oldOutterBar.width/2,
            oldOutterBar.y,
            oldOutterBar.width,
            oldOutterBar.height,
            4,
            colorcode);
        this.container.removeChild(oldOutterBar);
        this.container.addChild(outerBar);
        this.container.outerBar = outerBar;
        this.changedBar = true;
    }
  
}