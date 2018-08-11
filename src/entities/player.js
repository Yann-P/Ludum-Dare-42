const Phaser = require('phaser')


module.exports = class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.direction = false; // true = right

        var particles = scene.add.particles('particle');

        this.pEmitter = particles.createEmitter();
        this.setupEmitter();
        //this.setScale(3);
    }


    setupEmitter() {
        

        this.pEmitter.setSpeed(0);
        this.pEmitter.setLifespan({min: 500, max: 1000});
        this.pEmitter.setScale({min: 1, max: 4});
        this.pEmitter.setAlpha({ start: .7, end: 0, ease: 'Expo.easeIn' });
        this.pEmitter.setFrequency(100)
        
    }

    update() {

        this.pEmitter.setPosition(this.x, this.y + 15);
        this.pEmitter.on  = this.body.touching.down && Math.abs(this.body.velocity.x) > 1;

        if (this.cursors.left.isDown) {
            this.setVelocityX(-160);
            this.direction = false;
            this.setFrame(2)
        }
        else if (this.cursors.right.isDown) {
            this.setVelocityX(160);
            this.direction = true;
            this.setFrame(3)
        }
        else {
            this.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.body.touching.down) {
            this.setVelocityY(-330);
        } 


    }

}