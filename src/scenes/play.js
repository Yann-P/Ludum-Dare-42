const Scene = require('phaser').Scene;

module.exports = class Play extends Scene {

    constructor(levelId = 1) {
        super('PlayScene');
        this.levelId = levelId;
    }

    preload() {
        console.log('preload');
        this.load.image('test', 'assets/a.png');
        for(let i = 1; i <= 1; i++) {
            this.load.json(`level-${i}`, `maps/${i}.json`);
        }
    }

    create() {
        const sprite = this.add.sprite(0, 0, 'test').setScale(5);
        this.loadLevel();
    }

    loadLevel() {
        const level = this.cache.json.get(`level-${this.levelId}`);
        this.levelW = level.width;
        this.levelH = level.height;
        const platforms = level.layers.find(l => l.name === 'platforms');
        if(!platforms) throw new Error(`can't find platforms layer`);

        for(const p in platforms.objects) {
            
        }

    }

}