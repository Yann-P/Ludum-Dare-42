const Phaser = require('phaser')


module.exports = class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'test');
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.setScale(3);
    }

    update() {

        if (this.cursors.left.isDown) {
            this.setVelocityX(-160);
            //this.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.setVelocityX(160);
            //this.anims.play('right', true);
        }
        else {
            this.setVelocityX(0);
            //this.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.body.touching.down) {
            this.setVelocityY(-330);
        }

    }

}