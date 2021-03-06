import * as PIXI from 'pixi.js'
import { textStyle, getRoundedRectangle, getIntLength } from "./lib/PixiUtilMethods";

export default class Cards {
	static loadResources(app) {
        app.loader.add("assets/cards/cardBat.png"); //1
        app.loader.add("assets/cards/cardPistol.png"); //2
        app.loader.add("assets/cards/cardNetgun.png"); //3
        app.loader.add("assets/cards/cardWhistle.png"); //4
    }

    constructor(app) {
    	this.app = app;
    }

    prepareObject(x_pos, y_pos) {
        this.container = new PIXI.Container();

        // cards-container global position
        this.container.x = x_pos;
        this.container.y = y_pos;
        this.container.name = "cards";
        this.container._zIndex = Number.MAX_SAFE_INTEGER;
        // load cards textures
        let cardBatTexture = this.app.loader.resources["assets/cards/cardBat.png"].texture;
        let cardPistolTexture = this.app.loader.resources["assets/cards/cardPistol.png"].texture;
        let cardNetgunTexture = this.app.loader.resources["assets/cards/cardNetgun.png"].texture;
        let cardWhistleTexture = this.app.loader.resources["assets/cards/cardWhistle.png"].texture;

        // build sprites and scale them to 100x100
        let cardBatSprite = new PIXI.Sprite(cardBatTexture);
        cardBatSprite.scale.x = 0.10;
        cardBatSprite.scale.y = 0.10;
        cardBatSprite.name = "cardBat";

        let cardPistolSprite = new PIXI.Sprite(cardPistolTexture);
        cardPistolSprite.scale.x = 0.10;
        cardPistolSprite.scale.y = 0.10;
        cardPistolSprite.x = cardBatSprite.x + 30;
        cardPistolSprite.name = "cardPistol";
        let pistolAmmoText = new PIXI.Text("6/"+String.fromCharCode(8734), textStyle("Comic Sans MS", 120, 
            "center", ["#000000"], "#000000", 2));
        cardPistolSprite.addChild(pistolAmmoText);
        this.pistolAmmoText = pistolAmmoText;
        pistolAmmoText.x = 400;
        pistolAmmoText.y = 50;

        let cardNetgunSprite = new PIXI.Sprite(cardNetgunTexture);
        cardNetgunSprite.scale.x = 0.10;
        cardNetgunSprite.scale.y = 0.10;
        cardNetgunSprite.x = cardPistolSprite.x + 30;
        cardNetgunSprite.name = "cardNetgun";
        let netgunAmmoText = new PIXI.Text("2/"+String.fromCharCode(8734), textStyle("Comic Sans MS", 120, 
            "center", ["#000000"], "#000000", 2));
        cardNetgunSprite.addChild(netgunAmmoText);
        this.netgunAmmoText = netgunAmmoText;
        netgunAmmoText.x = 400;
        netgunAmmoText.y = 50;
        
        let cardWhistleSprite = new PIXI.Sprite(cardWhistleTexture);
        cardWhistleSprite.scale.x = 0.10;
        cardWhistleSprite.scale.y = 0.10;
        cardWhistleSprite.x = cardNetgunSprite.x + 30;
        cardWhistleSprite.name = "cardWhistle";

        // add card sprites to cards container and sort them by zIndex
        this.container.addChild(cardBatSprite);
        this.container.addChild(cardPistolSprite);
        this.container.addChild(cardNetgunSprite);
        this.container.addChild(cardWhistleSprite);

        this.resortCards(4, 3, 2, 1);

        // add the sprites to class for later use
        this.container.cardBatSprite = cardBatSprite;
        this.container.cardPistolSprite = cardPistolSprite;
        this.container.cardNetgunSprite = cardNetgunSprite;
        this.container.cardWhistleSprite = cardWhistleSprite;
    }

    initObject() {
        this.app.stage.addChild(this.container);
    }

    resortCards(batZ, pistolZ, netgunZ, whistleZ) {
        this.container.getChildByName("cardBat").zIndex = batZ;
        this.container.getChildByName("cardPistol").zIndex = pistolZ;
        this.container.getChildByName("cardNetgun").zIndex = netgunZ;
        this.container.getChildByName("cardWhistle").zIndex = whistleZ;
        this.container.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
    }

    highlightCard(card) {
        if (card === "bat") {
            this.resortCards(4, 3, 2, 1);
            if (this.container.cardBatSprite.y === 0) {
                this.container.cardBatSprite.y -= 10;
                this.container.cardPistolSprite.y = 0;
                this.container.cardNetgunSprite.y = 0;
                this.container.cardWhistleSprite.y = 0;
            }
        }
        else if (card === "pistol") {
            this.resortCards(3, 4, 2, 1);
            if (this.container.cardPistolSprite.y === 0) {
                this.container.cardPistolSprite.y -= 10;
                this.container.cardBatSprite.y = 0;
                this.container.cardNetgunSprite.y = 0;
                this.container.cardWhistleSprite.y = 0;
            }
        }
        else if (card === "netgun") {
            this.resortCards(1, 2, 4, 3);
            if (this.container.cardNetgunSprite.y === 0) {
                this.container.cardNetgunSprite.y -= 10;
                this.container.cardBatSprite.y = 0;
                this.container.cardPistolSprite.y = 0;
                this.container.cardWhistleSprite.y = 0;
            }
        }
        else if (card === "whistle") {
            this.resortCards(1, 2, 3, 4);
            if (this.container.cardWhistleSprite.y === 0) {
                this.container.cardWhistleSprite.y -= 10;
                this.container.cardBatSprite.y = 0;
                this.container.cardPistolSprite.y = 0;
                this.container.cardNetgunSprite.y = 0;
            }
        }
        else if (card === "none") {
            this.container.cardNetgunSprite.y = 0;
            this.container.cardBatSprite.y = 0;
            this.container.cardPistolSprite.y = 0;
        }
    }
  
}