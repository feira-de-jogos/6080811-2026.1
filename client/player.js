class player extends Phaser.Scene {
  constructor() {
    super("player");
  }

  preload() {
    this.load.setPath("assets/");
    this.load.spritesheet("android", "SpaceStation_Android_Sheet.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("character", "SpaceStation_Character_Sheet.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    this.anims.create({
      key: "android",
      frames: this.anims.generateFrameNumbers("android", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "character",
      frames: this.anims.generateFrameNumbers("character", {
        start: 8,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.android = this.add
      .sprite(300, 225, "android")
      .setScale(3)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("Android player selected");
        this.game.localPlayer = "android";
        this.game.socket.emit(
          "select-player",
          this.game.room,
          this.game.localPlayer,
        );
        this.scene.stop("player");
        this.scene.start("scene0");
      });
    this.android.play("android");

    this.character = this.add
      .sprite(550, 225, "character")
      .setScale(3)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("Character player selected");
        this.game.localPlayer = "character";
        this.game.socket.emit(
          "select-player",
          this.game.room,
          this.game.localPlayer,
        );
        this.scene.stop("player");
        this.scene.start("scene0");
      });
    this.character.play("character");
  }
}

export default player;
