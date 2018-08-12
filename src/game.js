const Phaser = require('phaser')
const Play = require('./scenes/play.js')

class Game extends Phaser.Game {

    constructor() {
        super({
            width: window.innerWidth,
            height: window.innerHeight,
            pixelArt: true,
            scene: [ Play ],
            render: {
                antialias : false
            },
            physics: {
                default: 'arcade',
                arcade: {
                    //debug: true,
                    gravity: { y: 1000 }
                }
            },
        });
    }


}

module.exports = Game;