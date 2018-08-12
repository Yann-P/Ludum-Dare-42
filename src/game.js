const Phaser = require('phaser')
const Play = require('./scenes/play.js')

class Game extends Phaser.Game {

    constructor() {
        super({
            width: 900*3,
            height: 600*3,
            pixelArt: true,
            scene: [ Play ],
            render: {
                antialias : false
            },
            physics: {
                default: 'arcade',
                arcade: {
                    debug: true,
                    gravity: { y: 1000 }
                }
            },
        });
    }


}

module.exports = Game;