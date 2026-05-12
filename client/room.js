class room extends Phaser.Scene {
  constructor() {
    super("room");
    this.qrcodeContainer = document.getElementById("qr-code");
  }

  preload() {
    this.load.image("white", "assets/white.png");
  }

  create() {
    if (this.game.room) {
      this.game.socket.emit("start-game", this.game.room, this.game.socket.id);

      this.scene.stop("room");
      this.scene.start("scene0");
    } else {
      this.add.image(400, 225, "white");
      this.game.room = (Math.random() * 10000).toString().split(".")[0];

      new QRCode(this.qrcodeContainer, {
        text: location.href + "?room=" + this.game.room,
        width: 450,
        height: 450,
      });
    }
    console.log("Joining room:", this.game.room);
    this.game.socket.emit("join-room", this.game.room);

    this.game.socket.on("start-game", (player) => {
      console.log("Game started in room:", this.game.room, "by player:", player);

      this.qrcodeContainer.remove();
      this.scene.stop("room");
      this.scene.start("scene0");
    });
  }
}

export default room;
