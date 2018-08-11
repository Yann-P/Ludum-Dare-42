const Scene = require('phaser').Scene;
const Player = require('../entities/player.js');


module.exports = class Play extends Scene {

    constructor(levelId = 1) {
        super('PlayScene');
        this.levelId = levelId;
    }

    preload() {
        this.load.image('test', 'assets/a.png');
        this.load.image('platform', 'assets/platform.png');

        for(let i = 1; i <= 1; i++) {
            this.load.json(`level-${i}`, `maps/${i}.json`);
        }
    }

    create() {
        this.player = null;
        this.platformsGroup = this.physics.add.group();
        this.loadLevel();
    }

    loadLevel() {
        const level = this.cache.json.get(`level-${this.levelId}`);
        this.levelW = level.width;
        this.levelH = level.height;
        const platforms = level.layers.find(l => l.name === 'platforms');
        if(!platforms) throw new Error(`can't find platforms layer`);

        for(const p of platforms.objects) {

            const x = p.x * CONFIG.TILESIZE,
                  y = p.y * CONFIG.TILESIZE,
                  w = p.width * CONFIG.TILESIZE,
                  h = p.height * CONFIG.TILESIZE;
            
            if(p.type === 'player') {
               this.player = new Player(this, 50, 50);
               this.physics.add.existing(this.player);
               this.physics.add.collider(this.platformsGroup, this.player);
               continue;
            }


            const sprite = this.add.sprite(
                    x, 
                    y,  
                    'platform')
            sprite.setSize(w, h);
            sprite.setScale(3);

            this.physics.add.existing(sprite);
            this.platformsGroup.add(sprite);

            sprite.body.immovable = true;
            sprite.body.allowGravity = false
            sprite.body.checkCollision.down = false;
        }

    }

    update() {
        this.player.update();
    }

}