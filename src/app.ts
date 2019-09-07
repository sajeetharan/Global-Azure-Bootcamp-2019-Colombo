import "phaser";
import { Game } from "./game";
import { Score } from "./score";

const config: GameConfig = {
  title: "GABCHero",
  width: "100%",
  height: 600,
  parent: "game",
  scene: [Game, Score],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 70 },
      debug: true
    }
  },
  backgroundColor: "#bfbfbf"
};

export class GabcheroGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var game = new GabcheroGame(config);
};
