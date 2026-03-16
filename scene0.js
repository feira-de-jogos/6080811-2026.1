class scene0 extends Phaser.Scene {
  constructor() {
    super("scene0");
  }

  preload() {
    this.load.spritesheet("zombie", "assets/zombie.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.anims.create({
      key: "stand-still",
      frames: this.anims.generateFrameNumbers("zombie", { start: 20, end: 20 }),
      frameRate: 1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("zombie", { start: 87, end: 95 }),
      frameRate: 10,
      repeat: -1,
    });

    this.zombie = this.physics.add
      .sprite(400, 225, "zombie", 20)
      .setInteractive()
      .on("pointerdown", () => {
        if (this.zombie.body.velocity.x === 0) {
          this.zombie.play("walk-right");
          this.zombie.setVelocityX(100);
        } else {
          this.zombie.play("stand-still");
          this.zombie.setVelocityX(0);
        }
      });
  }
}

export default scene0;
