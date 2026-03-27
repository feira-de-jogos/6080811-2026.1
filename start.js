class start extends Phaser.Scene {
  constructor() {
    super("start");
  }

  preload() {
    this.load.setPath("assets/");
    this.load.image("start", "start-background.png");
  }

  create() {
    this.add
      .image(400, 225, "start")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("scene0");
      });
  }
}

export default start;
