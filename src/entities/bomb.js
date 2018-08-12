
module.exports = class Bomb extends Phaser.Physics.Arcade.Sprite {



    constructor(scene, x, y) {
        super(scene, x, y, 'bomb');
        this.scene = scene;
        this.setScale(2)
        scene.physics.add.existing(this);

        this.body.setSize(this.width, this.height);

        this.timer = scene.time.addEvent({ 
            delay: 500, 
            callback: this.action.bind(this), 
            loop: true 
        });

        this.sparkParticles =  scene.add.particles('spark')

        this.pEmitter =this.sparkParticles.createEmitter({
            radial: true,
            lifespan: 1000,
            speed: {min:20, max: 50},
            alpha: { start: 1, end: 0, ease: 'Power3' },
            scale: { start: 1.5, end: 1, ease: 'Power3' },
        });

        this.pEmitter.startFollow(this, 0, -15)

        this.direction = 0; // 0=idle 1=left 2=right

    }

    action() {

        // THE BEST KIND OF AI
        // vvvvvvvvvvvvvvvvvvv

        if(Phaser.Math.Distance.Between(this.scene.player.x, this.scene.player.y,
            this.x, this.y) < 500) {

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
        if(Phaser.Math.Distance.Between(this.scene.player.x, this.scene.player.y,
                this.x, this.y) < 100) {

            if(rnd.nextFloat() < .3){
                this.explode();
            }
        }
    }

    jump() {
        if(this.body.touching.down)
            this.body.velocity.y = -500
    }

    destroy() {
        this.timer.destroy();
        this.sparkParticles.destroy();
        super.destroy();
    }

    explode() {
        this.scene.player.setControllable(false)
        const particles = this.scene.add.particles('spark')
        particles.createEmitter({
            radial: true,
            lifespan: 300,
            quantity: 10,
            x: this.x,
            y: this.y,
            speed: {min:100, max: 500},
            alpha: { start: 1, end: 0.5, ease: 'Power3' },
            scale: { start: 6, end: 2, ease: 'Power3' },
        });
        this.scene.time.delayedCall(200, () => {
            this.scene.player.setControllable(true)

            particles.destroy();
            this.destroy();
        });


        const player = this.scene.player; 
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y); // radian
        const force = 400
        this.scene.player.setVelocity(Math.cos(angle) * force, Math.sin(angle) * force - 400)

        
        
    }
    

}