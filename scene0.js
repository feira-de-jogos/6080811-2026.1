class scene0 extends Phaser.Scene {
  constructor() {
    super("scene0");

    this.threshold = 0.1;
    this.speed = 100;
    this.direction = undefined;
    this.money = 0;
    this.timer = 120;
  }

  preload() {
    this.load.spritesheet("zombie", "assets/zombie.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("buttons", "assets/buttons.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.plugin(
      "rexvirtualjoystickplugin",
      "./rexvirtualjoystickplugin.min.js",
      true,
    );

    this.load.audio("music", "assets/music.mp3");
    this.load.audio("laser", "assets/laser.mp3");
  }

  create() {
    this.music = this.sound.add("music", { loop: true }).play();
    this.laser = this.sound.add("laser");

    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("zombie", { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("zombie", { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("zombie", { start: 24, end: 31 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("zombie", { start: 16, end: 23 }),
      frameRate: 10,
      repeat: -1,
    });

    this.zombie = this.physics.add.sprite(400, 225, "zombie", 20);

    this.joystick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 100,
      y: 350,
      radius: 50,
      base: this.add.circle(0, 0, 50, 0xcccccc),
      thumb: this.add.circle(0, 0, 25, 0x666666),
    });

    this.joystick.on("update", () => {
      const angle = Phaser.Math.DegToRad(this.joystick.angle);
      const force = this.joystick.force;

      if (force > this.threshold) {
        this.direction = new Phaser.Math.Vector2(
          Math.cos(angle),
          Math.sin(angle),
        ).normalize();
      }

      if (this.joystick.force > 0) {
        this.zombie.setVelocity(
          this.direction.x * this.speed,
          this.direction.y * this.speed,
        );

        switch (true) {
          case this.joystick.angle >= -135 && this.joystick.angle < -45:
            this.zombie.anims.play("walk-up", true);
            break;
          case this.joystick.angle >= -45 && this.joystick.angle < 45:
            this.zombie.anims.play("walk-right", true);
            break;
          case this.joystick.angle >= 45 && this.joystick.angle < 135:
            this.zombie.anims.play("walk-down", true);
            break;
          case this.joystick.angle >= 135 || this.joystick.angle < -135:
            this.zombie.anims.play("walk-left", true);
            break;
        }
      } else {
        this.zombie.setVelocity(0, 0);
        this.zombie.anims.stop();
      }
    });

    this.button = this.add
      .sprite(700, 350, "buttons", 10)
      .setScale(4)
      .setInteractive()
      .on("pointerdown", () => {
        this.button.setFrame(11);
      })
      .on("pointerup", () => {
        this.button.setFrame(10);
        this.money += 10;
        this.textMoney.setText(`Money: ${this.money}`);
        this.laser.play();
      });

    this.textMoney = this.add.text(16, 16, `Money: ${this.money}`, {
      fontSize: "32px",
      fill: "#ffffff",
    });

    this.textTime = this.add.text(16, 50, `Time: ${this.timer}`, {
      fontSize: "32px",
      fill: "#ffffff",
    });

    setInterval(() => {
      this.timer -= 1;
      this.textTime.setText(`Time: ${this.timer}`);

      if (this.timer <= 0) {
        this.scene.stop();
        this.scene.start("game-over");
      }
    }, 1000);
  }
}

export default scene0;
0;
