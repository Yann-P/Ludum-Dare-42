const Phaser = require('phaser');

module.exports = class Petrol extends Phaser.GameObjects.TileSprite {



    constructor(scene, x, y, w, h) {
        super(scene, x, y, w, h, 'petrol')
        this.setOrigin(0,0)
        this.setScale(3);
        
        scene.physics.add.existing(this, false);
        scene.petrolGroup.add(this);
        scene.add.existing(this)
        this.setSize(w/3, h/3);


        this.body.immovable = true;
        this.body.allowGravity = false
        this.body.checkCollision.down = false;

    }

}