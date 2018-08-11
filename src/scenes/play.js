const Scene = require('phaser').Scene;
const Player = require('../entities/player.js');
const Light = require('../entities/light.js');
const Petrol = require('../entities/petrol.js');


module.exports = class Play extends Scene {

    constructor() {
        super('PlayScene');
    }

    preload() {
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 46, frameHeight: 34 });

        for(const n of ['bg', 'light', 'particle', 'bubble', 'platform', 'petrol'])
            this.load.image(n,  `assets/${n}.png`);

        for (let i = 1; i <= 1; i++) {
            this.load.json(`level-${i}`, `maps/${i}.json`);
        }
    }

    create(data) {
        this.levelId = data.levelId || 1;
        this.player = null;
        this.platformsGroup = this.add.group();
        this.petrolGroup = this.add.group();

        this.background = this.add.tileSprite(0, 0, 800, 600, 'bg').setScale(3)
        this.lightRadius = 300;

        const { lx, ly } = this.loadLevel();
        this.setupLight(lx, ly);
        this.setLightRadius(3000)

        this.physics.add.collider(this.petrolGroup, this.player, (pe, pl) => {
            pl.setDrinking(true);
            pe.height-=.5
            pe.y+=.5
            pe.body.y++
            pe.body.height--

            //pe.body.updateBounds();
        });
    }

    setLightRadius(r) {
        this.lightRadius = r;
        this.light.setRadius(r);
    }

    setupLight(x, y) {
        this.light = new Light(this, x, y)
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

            switch (p.type) {
                case 'player':
                    this.addPlayer(x, y, w, h)
                    break;

                case 'light':
                    lx = x, ly = y; break;
                case 'petrol':
                    this.addPetrol(x, y, w, h);
                    break;
                default:
                    this.addPlatform(x, y, w, h)

            }
        }
        return { lx, ly };

    }

    addPlayer(x, y, w, h) {
        this.player = new Player(this, x, y);
        this.add.existing(this.player)
        this.physics.add.existing(this.player);
        this.physics.add.collider(this.platformsGroup, this.player);
    }

    addPetrol(x, y, w, h) {
        const petrol = new Petrol(this, x, y, w, h)
        //this.petrolGroup.add(petrol);
    }

    addPlatform(x, y, w, h) {
        const sprite = this.add.tileSprite(
            x,
            y,
            w,
            h,
            'platform')

        sprite.setOrigin(0,0)
        sprite.setScale(3);
        
        this.physics.add.existing(sprite, false);
        this.platformsGroup.add(sprite);
        sprite.setSize(w/3, h/3);

        sprite.body.immovable = true;
        sprite.body.allowGravity = false
        sprite.body.checkCollision.down = false;
    }

    update() {
        this.light.x = this.player.x, this.light.y = this.player.y

        this.player.update();
    }

}