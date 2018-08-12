const Phaser = require('phaser')


module.exports = class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.direction = false; // true = right
        this.isDrinking = false;
        this.isVomitting = false;


        this.bubbles = scene.add.particles('bubble')
        
        this.wEmitter = scene.add.particles('particle').createEmitter();
        this.vEmitter = this.bubbles.createEmitter({
            radial: false,
            lifespan: 500,
            gravityY: 200,
            scale: { start: .5, end: 1, ease: 'Power3' },
        });


        this.scene = scene
        this.setupWEmitter();
        //this.setScale(3);
    }

    setDrinking(v) { this.isDrinking = v }

    setVomit(v) { this.isVomitting = v }


    setupWEmitter() {
        this.wEmitter.setSpeed(0);
        this.wEmitter.setLifespan({min: 500, max: 1000});
        this.wEmitter.setScale({min: 1, max: 4});
        this.wEmitter.setAlpha({ start: .7, end: 0, ease: 'Expo.easeIn' });
        this.wEmitter.setFrequency(100)
    }


    update() {
        this.scene.children.bringToTop(this.bubbles)

        this.wEmitter.setPosition(this.x, this.y + 15);
        this.wEmitter.on  = this.body.touching.down && Math.abs(this.body.velocity.x) > 1;
        
        this.vEmitter.on  = this.isVomitting
        this.vEmitter.setPosition(this.x + (this.direction ? 15 : -15), this.y);
        this.vEmitter.setSpeed({min: 50, max: 100}) // fuck encapsulation this is a jam
        this.vEmitter.setAngle(Phaser.Math.Angle.Between(

            this.x, this.y, this.scene.sun.x, this.scene.sun.y
        ) / Math.PI * 180)
        



        if (this.cursors.left.isDown) {
            this.setVelocityX(-260);
            this.direction = false;
        }
        else if (this.cursors.right.isDown) {
            this.setVelocityX(260);
            this.direction = true;
        }
        else {
            this.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.body.touching.down) {
            this.setVelocityY(-500);
        } 

        if(this.isVomitting) {
            this.setFrame(this.direction ? 5 : 4);
        } else this.setFrame((this.direction ? 3 : 2) - (this.isDrinking ? 2 : 0))



    }

}