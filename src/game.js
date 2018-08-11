const Phaser = require('phaser')
const Play = require('./scenes/play.js')

class Game extends Phaser.Game {

    constructor() {
        super({
            width: 900*3,
            height: 600*3,
            pixelArt: true,
            scene: [ Play ]
        });
    }


}

module.exports = Game;