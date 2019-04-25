import UserInterface from './UserInterface';
import { getRandomArbitraryInt } from "./lib/UtilMethods";
import { containSpriteInsideContainer, setTextureOnlyIfNeeded, checkDynamicIntoDynamicCollision } from "./lib/PixiUtilMethods";
import HealthBar from "./HealthBar";

export default class Monster {
	static loadResources() {
		PIXI.loader.add("assets/monsters/angryMonster.png");
		PIXI.loader.add("assets/monsters/normalMonster.png");
		PIXI.loader.add("assets/capturedMonsters/angryMonster.png");
		PIXI.loader.add("assets/capturedMonsters/normalMonster.png");
		PIXI.loader.add("assets/deadMonsters/angryMonster.png");
		PIXI.loader.add("assets/deadMonsters/normalMonster.png");
	}
	
	constructor(app, isAngry) {
		this.app = app;
		this.isAngry = isAngry;
		this.healthBar = new HealthBar(this.app);
	}
	
	prepareObject(x_pos, y_pos, i) {
		// SETUP monster
		//console.log("monster" + i);
		if (this.isAngry) {
			this.monsterTexture = PIXI.loader.resources["assets/monsters/angryMonster.png"].texture;
			this.capturedMonsterTexture = 
				PIXI.loader.resources["assets/capturedMonsters/angryMonster.png"].texture;
			this.deadMonsterTexture = 
				PIXI.loader.resources["assets/deadMonsters/angryMonster.png"].texture;
			this.healthBar.prepareObject(x_pos, y_pos - 12, 48, 8, 0xFF3300, 15);
		}
		else {
			this.monsterTexture = PIXI.loader.resources["assets/monsters/normalMonster.png"].texture;
			this.capturedMonsterTexture = 
				PIXI.loader.resources["assets/capturedMonsters/normalMonster.png"].texture;
			this.deadMonsterTexture = 
				PIXI.loader.resources["assets/deadMonsters/normalMonster.png"].texture;
			this.healthBar.prepareObject(x_pos, y_pos - 6, 32, 8, 0xFF3300, 10);
		}

		this.monsterSprite = new PIXI.Sprite(this.monsterTexture);
		if (this.isAngry) {
			this.monsterSprite.scale.x = 0.06;
			this.monsterSprite.scale.y = 0.06;
		}
		else {
			this.monsterSprite.scale.x = 0.15;
			this.monsterSprite.scale.y = 0.15;
		}

		this.monsterSprite.x = Math.round(x_pos - (this.monsterSprite.width/2));
		this.monsterSprite.y = y_pos;
		this.monsterSprite.vx = 0;
		this.monsterSprite.vy = 0;
		this.monsterSprite.name = "monster" + i;
		this.monsterSprite.captured = false;
		this.monsterSprite.dead = false;
		this.monsterSprite.grabbed = false;
		this.newDirTimeStep = 50.0;
		this.timeSinceNewDir = 0.0;
		// hack to be able to move healthbar when finding children
		this.monsterSprite.healthBar = this.healthBar;
		this.monsterSprite.isAngry = this.isAngry;
	}

	initObject() {
		this.healthBar.initObject();
		this.app.stage.addChild(this.monsterSprite);
		console.log("monster character initialized");
	}

	initLoop(player) {
		// start the monster loop
		this.app.ticker.add(delta => this.monsterLoop(delta, player));
		console.log("monster loop initialized");
	}

	monsterLoop(delta, player) {
		if (!player.ui.isPaused() && !this.isCaptured() && !this.isDead()) {
			this.timeSinceNewDir += delta;
			if(this.timeSinceNewDir > this.newDirTimeStep) {
				this.timeSinceNewDir = 0.0;

				let randomNumber = Math.random();
				if (randomNumber >= 0 && randomNumber < 0.25) {
					this.monsterSprite.vx = 2;
					this.monsterSprite.vy = 0;
				}
				else if (randomNumber >= 0.25 && randomNumber < 0.50) {
					this.monsterSprite.vx = 0;
					this.monsterSprite.vy = 2;
				}
				else if (randomNumber >= 0.50 && randomNumber < 0.75) {
					this.monsterSprite.vx = -2;
					this.monsterSprite.vy = 0;
				}
				else if (randomNumber >= 0.75 && randomNumber < 1) {
					this.monsterSprite.vx = 0;
					this.monsterSprite.vy = -2;
				}
				//this.monsterSprite.vx = 0;
				//this.monsterSprite.vy = 0;
			}

			let monsterHitsMapBound = containSpriteInsideContainer(this.monsterSprite, 
				{x: 0, y: 0, width: 1024, height: 1024});


			let allVisibleNets = this.app.stage.children.filter(child => 
				child.name.indexOf("net") !== -1 && child.visible === true);
			let allVisibleBullets = this.app.stage.children.filter(child => 
				child.name.indexOf("bullet") !== -1 && child.visible === true);
			let houses = this.app.stage.children.filter(child => 
				child.name.indexOf("house") !== -1);

			if (allVisibleNets !== undefined && allVisibleNets.length !== 0) {
				//console.log(allVisibleNets);
				for (var i = 0; i < allVisibleNets.length; i++) {
				    if(checkDynamicIntoDynamicCollision(this.monsterSprite, allVisibleNets[i])) {
				    	// make it invisible
				    	allVisibleNets[i].visible = false;
				    	// convert health string to int
				    	let healthValue = +this.healthBar.container.valueText.text;
				    	if (healthValue <= this.healthBar.container.maxHealth/2) {
				    		// stop monster
							this.stopMonster(player);
				    	}
					}
				}
			}
			
			if (allVisibleBullets !== undefined && allVisibleBullets.length !== 0) {
				for (var i = 0; i < allVisibleBullets.length; i++) {
				    if(checkDynamicIntoDynamicCollision(this.monsterSprite, allVisibleBullets[i])) {
				    	// make bullet invisible
				    	allVisibleBullets[i].visible = false;
				    	// harm monster
						this.harmMonster(player, "pistol");
					}
				}
			}

			if (houses !== undefined && houses.length !== 0) {
				for (var i = 0; i < houses.length; i++) {
				    if(checkDynamicIntoDynamicCollision(this.monsterSprite, houses[i])) {
						// monster reverts direction
						this.reverseMonsterDirection();
					}
				}
			}

			if (monsterHitsMapBound !== "none") {
				this.reverseMonsterDirection();
			}
			else if (this.monsterSprite.vx !== 0) {
				// walking horizontally
				this.monsterSprite.x += this.monsterSprite.vx;
				// move healthbar
				this.healthBar.container.x += this.monsterSprite.vx;
			}
			else if (this.monsterSprite.vy !== 0) {
				// walking vertically
				this.monsterSprite.y += this.monsterSprite.vy;
				// move healthbar
				this.healthBar.container.y += this.monsterSprite.vy;
			}
			else {
				// character isn't walking: do nothing
			}
		}
	}

	reverseMonsterDirection() {
		// if monsters hits wall we reverse his speed so he doesn't stop moving
		if (this.monsterSprite.vx !== 0) {
			this.monsterSprite.vx *= -1;
		}
		else if (this.monsterSprite.vy !== 0){
			this.monsterSprite.vy *= -1;
		}
		else {
			// shouldn't happen
		}
	}

	stopMonster(player) {
		// monster must be with less than half of his HP to be captured
		setTextureOnlyIfNeeded(this.monsterSprite, this.capturedMonsterTexture);
		this.monsterSprite.captured = true;
		this.monsterSprite.vx = 0;
		this.monsterSprite.vy = 0;
		player.ui.score.addScore(this.isAngry?2:1);
		// else monster not stopped!
	}

	harmMonster(player, weapon) {
		if (weapon === "pistol") {
			// weapon: 50% chance 1 dmg, 50% chance 2 dmg
			let randomInt = getRandomArbitraryInt(1, 2);
			this.healthBar.subtractHealth(randomInt);
		}

		let healthValue = +this.healthBar.container.valueText.text;

		if (!this.healthBar.isChanged() && healthValue <= this.healthBar.container.maxHealth/2) {
			console.log("changing");
			// healthbar color change
			this.healthBar.changeBarColor(0xffffff);
		}
		// if health is 0 then monster is dead
		else if (healthValue === 0) {
			this.killMonster(player);
		}
		// else monster is ok!
	}

	killMonster(player) {
		setTextureOnlyIfNeeded(this.monsterSprite, this.deadMonsterTexture);
		this.monsterSprite.dead = true;
		this.monsterSprite.vx = 0;
		this.monsterSprite.vy = 0;
		player.ui.score.addScore(this.isAngry?-2:-1);
	}

	isCaptured() {
		return this.monsterSprite.captured;
	}

	isDead() {
		return this.monsterSprite.dead;
	}
}
