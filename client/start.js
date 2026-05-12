class start extends Phaser.Scene {
  constructor() {
    super("start");
  }

  init() {
    let room = new URLSearchParams(location.search).get("room");
    if (room) this.game.room = room;
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
        this.scene.stop("start");
        this.scene.start("room");
      });
  }
}

export default start;
