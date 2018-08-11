const Phaser = require('phaser')


module.exports = class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.direction = false; // true = right
        this.isDrinking = false;

        var particles = scene.add.particles('particle');

        this.pEmitter = particles.createEmitter();
        this.setupEmitter();
        //this.setScale(3);
    }

    setDrinking(v) { this.isDrinking = v }


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
        }
        else if (this.cursors.right.isDown) {
            this.setVelocityX(160);
            this.direction = true;
        }
        else {
            this.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.body.touching.down) {
            this.setVelocityY(-400);
        } 

        this.setFrame((this.direction ? 3 : 2) - (this.isDrinking ? 2 : 0))

        this.setDrinking(false)


    }

}