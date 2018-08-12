
module.exports = class Light extends Phaser.GameObjects.Sprite {


    constructor(scene, x, y) {
        super(scene, x, y, 'light');
    }

    setRadius(r) {
        this.setScale(r / 300);
    }

}