import config from "./config";
import scene0 from "./scene0";

class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.scene.add("scene0", scene0);
    this.scene.start("scene0");
  }
}

window.onload = () => {
  window.game = new Game();
};
