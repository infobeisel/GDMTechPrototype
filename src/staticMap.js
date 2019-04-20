export default class StaticMap {
	static loadResources() {
    PIXI.loader.add("assets/background.png");
  }

  constructor(app) {
  	this.app = app;
  }
  
  prepareObject() {
  	let backgroundTexture = PIXI.loader.resources["assets/background.png"].texture;
  	this.backgroundSprite = new PIXI.Sprite(backgroundTexture);
  }

  initObject() {
  	this.app.stage.addChild(this.backgroundSprite);
    console.log("background initialized");
  }
  
}