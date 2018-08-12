const Player = require('../entities/player.js');
const Light = require('../entities/light.js');
const Petrol = require('../entities/petrol.js');
const Bomb = require('../entities/bomb.js');
const Cacti = require('../entities/cacti.js');


module.exports = class Play extends Phaser.Scene {

    constructor() {
        super('PlayScene');
        this._i=0;
    }

    preload() {
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 46, frameHeight: 34 });

        for(const n of ['bg', 'bomb', 'sun', 'light', 'spark', 'cactus',
                        'particle', 'bubble', 'platform', 'petrol'])
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
        this.enemiesGroup = this.add.group();

        this.petrolQtty = 10;

        this.background = this.add.tileSprite(0, 0, this.sys.canvas.width, this.sys.canvas.height, 'bg').setScale(3)
        this.background.setScrollFactor(0)
        this.lightRadius = 300;

        const { lx, ly } = this.loadLevel();
        this.setupLight(lx, ly);
        this.setLightRadius(1000)
        this.children.bringToTop(this.player)
        this.children.bringToTop(this.light)

        this.physics.add.collider(this.platformsGroup, this.enemiesGroup);
        this.physics.add.collider(this.petrolGroup, this.enemiesGroup);

        this.physics.add.collider(this.petrolGroup, this.player, (pe, pl) => {
            pl.setDrinking(true);
            pe.height-=.5
            pe.y+=.5
            pe.body.y++
            pe.body.height--

            this.petrolQtty++;
        });

        this.cameras.main.startFollow(this.player);


    }

    setLightRadius(r) {
        this.lightRadius = r;
        this.light.setRadius(r);
    }

    setupLight(x, y) {
        this.light = new Light(this, x, y)
        this.sun = this.add.sprite(x+11, y+4, 'sun')
        this.sun.setScale(2)
        this.add.existing(this.light)
    }

    loadLevel() {
        let lx, ly;
        const level = this.cache.json.get(`level-${this.levelId}`);
        this.levelW = level.width;
        this.levelH = level.height;

        console.log(this.levelW * CONFIG.TILESIZE)
        this.cameras.main.setBounds(0, 0, this.levelW * CONFIG.TILESIZE, this.levelH * CONFIG.TILESIZE);

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
                case 'flame':
                    lx = x, ly = y; 
                    break;
                case 'petrol':
                    this.addPetrol(x, y, w, h);
                    break;
                case 'bomb':
                    this.addBomb(x, y);
                    break;
                case 'cacti':
                    this.addCacti(x, y);
                    break;
                default:
                    this.addPlatform(x, y, w, h)

            }
        }
        return { lx, ly };

    }

    addBomb(x, y) {
        const bomb = new Bomb(this, x, y);
        this.add.existing(bomb)
        this.enemiesGroup.add(bomb)
    }

    addCacti(x, y) {
        const cacti = new Cacti(this, x, y);
        this.add.existing(cacti)
        this.enemiesGroup.add(cacti)
    }

    addPlayer(x, y, w, h) {
        this.player = new Player(this, x, y);
        this.add.existing(this.player)
        this.physics.add.existing(this.player);
        this.physics.add.collider(this.platformsGroup, this.player, (plat, play) => {
            play.setDrinking(false)
        });
    }

    addPetrol(x, y, w, h) {
        const petrol = new Petrol(this, x, y, w, h)
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
        this._i++
        this.player.update();
        if(!Phaser.Geom.Rectangle.Intersection(this.sun.getBounds(), 
            this.player.getBounds()).isEmpty() && this.petrolQtty != 0 && this._i % 2 == 0) {

            this.player.setVomit(true)
            this.setLightRadius(this.lightRadius+100)
            this.petrolQtty--;
        } else {
            this.player.setVomit(false)
        }

        if(this.lightRadius > 200) {
            this.setLightRadius(this.lightRadius-1)
        }


        if(Phaser.Math.Distance.Between(this.player.x, this.player.y,
            this.sun.x, this.sun.y) > this.lightRadius - 200) {
                console.log('gameover')
            }
    }

}