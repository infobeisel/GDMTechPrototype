import HealthBar from "./HealthBar";
import Cards from "./Cards";
import PauseScreen from "./PauseScreen";

export default class UserInterface {
	static loadResources() {
		HealthBar.loadResources();
		Cards.loadResources();
		PauseScreen.loadResources();
		PIXI.loader.add("assets/crosshairs/crosshair.png");
	}
	
	constructor(app) {
		this.app = app;
		this.healthBar = new HealthBar(this.app);
		this.cards = new Cards(this.app);
		this.pauseScreen = new PauseScreen(this.app);

	}

	// HEALTHBAR
	prepareHealthbar(x_pos, y_pos) {
		this.healthBar.prepareObject(x_pos, y_pos, 64, 8, 0x4CBB17, 20);
	}


	prepareCrosshair(x_pos, y_pos) {
		let crosshairTex = PIXI.loader.resources["assets/crosshairs/crosshair.png"].texture;
		this.crosshair = new PIXI.Sprite(crosshairTex);
		this.crosshair.scale.x = 0.1;
		this.crosshair.scale.y = 0.1;
		this.crosshair.x = 512;
		this.crosshair.y = 512;
		this.crosshair.visible = false;
	}

	initCrosshair() {
		this.app.stage.addChild(this.crosshair);
		console.log("crosshair  initialized");
	}




	initHealthbar() {
		this.healthBar.initObject();
	}

	// CARDS
	prepareCards(x_pos, y_pos) {
		this.cards.prepareObject(x_pos, y_pos);
	}

	initCards() {
		this.cards.initObject();
	}

	resortCards(batZ, pistolZ, netgunZ) {
		this.cards.resortCards(batZ, pistolZ, netgunZ);
	}

	highlightCard(card) {
		this.currentItem = card;
		this.cards.highlightCard(card);
	}

	// PAUSE
	preparePauseScreen(x_pos, y_pos) {
		this.pauseScreen.prepareObject(x_pos, y_pos, 350, 400);
	}

	initPauseScreen() {
		this.pauseScreen.initObject();
	}

	togglePause() {
		// TODO: darken all sprites
		// TODO: pause screen with command information
		this.pauseScreen.toggle();
	}

	isPaused() {
		return this.pauseScreen.container.visible;
	}
}
