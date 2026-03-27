import config from "./config.js";
import start from "./start.js";
import scene0 from "./scene0.js";

class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.scene.add("start", start);
    this.scene.add("scene0", scene0);
    this.scene.start("start");
  }
}

window.onload = () => {
  window.game = new Game();
};
