const Scene = require('phaser').Scene;
const Player = require('../entities/player.js');
const Light = require('../entities/light.js');


module.exports = class Play extends Scene {

    constructor(levelId = 1) {
        super('PlayScene');
        this.levelId = levelId;
    }

    preload() {
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 46, frameHeight: 34 });

        this.load.image('bg', 'assets/bg.png');
        this.load.image('light', 'assets/light.png');

        this.load.image('particle', 'assets/particle.png');


        this.load.image('platform', 'assets/platform.png');

        for (let i = 1; i <= 1; i++) {
            this.load.json(`level-${i}`, `maps/${i}.json`);
        }
    }

    create() {
        this.player = null;
        this.platformsGroup = this.physics.add.group();
        this.background = this.add.tileSprite(0, 0, 800, 600, 'bg').setScale(3)
        const {lx, ly} = this.loadLevel();
        this.setupLight(lx, ly);
    }

    setupLight(x, y) {
        this.light = new Light(this, x, y)
        this.light.setRadius(100)
        this.add.existing(this.light)
    }

    loadLevel() {
        let lx, ly;
        const level = this.cache.json.get(`level-${this.levelId}`);
        this.levelW = level.width;
        this.levelH = level.height;
        const platforms = level.layers.find(l => l.name === 'platforms');
        if (!platforms) throw new Error(`can't find platforms layer`);

        for (const p of platforms.objects) {

            const x = p.x * CONFIG.TILESIZE,
                y = p.y * CONFIG.TILESIZE,
                w = p.width * CONFIG.TILESIZE,
                h = p.height * CONFIG.TILESIZE;

            if (p.type === 'player') {
                this.player = new Player(this, x, y);
                this.add.existing(this.player)
                this.physics.add.existing(this.player);
                this.physics.add.collider(this.platformsGroup, this.player);
                continue;
            }

            else if (p.type === 'light') {
                lx = x, ly = y;
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
        return { lx, ly };

    }

    update() {
        this.light.x = this.player.x,         this.light.y = this.player.y

        this.player.update();
    }

}