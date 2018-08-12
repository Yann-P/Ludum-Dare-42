
module.exports = class Cacti extends Phaser.Physics.Arcade.Sprite {



    constructor(scene, x, y) {
        super(scene, x, y, 'cactus');
        this.scene = scene;
        this.setScale(2)
        scene.physics.add.existing(this);

        this.body.setSize(this.width, this.height);

        this.timer = scene.time.addEvent({ 
            delay: 500, 
            callback: this.action.bind(this), 
            loop: true 
        });


    }

    action() {

        // THE BEST KIND OF AI
        // vvvvvvvvvvvvvvvvvvv

        if(rnd.nextFloat() < .1) {
            this.jump();
        }
        
        if(rnd.nextFloat() < .1) {
            this.setVelocityX(100)
        }

        if(rnd.nextFloat() < .1) {
            this.setVelocityX(-100)

        }

        if(rnd.nextFloat() < .1) {
            this.setVelocityX(0)
        }
    }

    jump() {
        if(this.body.touching.down)
            this.body.velocity.y = -500
    }

    destroy() {
        this.timer.destroy();
        super.destroy();
    }

}