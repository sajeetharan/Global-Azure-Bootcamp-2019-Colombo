import "phaser";
import { Gabc } from "./detect";

export class Game extends Phaser.Scene {
  rectangle: any;
  emojis: Phaser.GameObjects.Group;
  imageCapture: any;
  faceDrop: number;
  sand: Phaser.Physics.Arcade.World;
  resultLabel: Phaser.GameObjects.Text;
  chanceLabel: Phaser.GameObjects.Text;
  scoreLabel: Phaser.GameObjects.Text;
  totalPlayersLabel: Phaser.GameObjects.Text;
  emoj: any;
  score: number = 0;
  emotions: Array<string> = [
    "anger",
    "fear",
    "happiness",
    "neutral",
    "sadness",
    "surprise"
  ];

  video: any;
  canvas: any;
  streaming: any = false;
  width: number = 320;
  height: number = 0;

  constructor() {
    super({
      key: "Game"
    });
  }

  init(params): void {
    this.faceDrop = 0;
    this.video = document.getElementById("video");
    this.canvas = document.getElementById("canvas");
    this.initMedia();
  }

  async initMedia() {
    try {
      let stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });
      this.video.srcObject = stream;
      this.video.play();
      const track = stream.getVideoTracks()[0];
      this.imageCapture = new ImageCapture(track);

      this.video.addEventListener("canplay", evt => this.canplay(), false);
    } catch (error) {
      console.log("An error occurred: " + error);
    }
  }

  canplay(): void {
    if (!this.streaming) {
      this.height =
        this.video.videoHeight / (this.video.videoWidth / this.width);
      if (isNaN(this.height)) {
        this.height = this.width / (4 / 3);
      }

      this.video.setAttribute("width", this.width);
      this.video.setAttribute("height", this.height);
      this.canvas.setAttribute("width", this.width);
      this.canvas.setAttribute("height", this.height);
      this.streaming = true;
    }
  }

  preload(): void {
    this.load.image("background", "assets/bg-1.png");
    this.load.image("anger", "assets/emoj/anger.png");
    this.load.image("fear", "assets/emoj/fear.png");
    this.load.image("happiness", "assets/emoj/happiness.png");
    this.load.image("neutral", "assets/emoj/neutral.png");
    this.load.image("sadness", "assets/emoj/sadness.png");
    this.load.image("surprise", "assets/emoj/surprise.png");
  }

  create(): void {
    this.add.image(400, 300, "background");
    this.emojis = this.add.group();

    setInterval(() => {
      const emotion = this.emotions[
        Math.floor(Math.random() * (this.emotions.length - 1))
      ];
      const emoj = new Gabc(this, 550, 24, emotion);
      this.add.existing(emoj);
      this.emojis.add(emoj);
    }, 14000);

    this.rectangle = this.add.rectangle(550, 530, 1000, 20, 0x2c2c2c, 0.3);
    this.scoreLabel = this.add.text(
      10,
      10,
      `Your Score: ${this.score.toString()}`,
      {
        font: "25px Arial",
        fill: "#000"
      }
    );

    this.chanceLabel = this.add.text(350, 10, `Completed Chances: 0/5`, {
      font: "25px Arial",
      fill: "#000"
    });

    this.totalPlayersLabel = this.add.text(800, 10, `Total Players: 0`, {
      font: "25px Arial",
      fill: "#000"
    });
  }

  update(time): void {
    this.emojis.children.entries.forEach(emoj => {
      emoj.update(time);
    });
  }

  updateScore(x: number, result: any) {
    this.faceDrop += 1;
    this.score += x * 100;
    this.scoreLabel.setText(`Your Score: ${+this.score.toFixed(0).toString()}`);
    this.chanceLabel.setText(`Completed Chances: ${+this.faceDrop}/5`);
    this.totalPlayersLabel.setText(`Total Players: 0`);
    if (this.faceDrop > 4) {
      this.resultLabel = this.add.text(
        10,
        140,
        `Game over your total score : ${+this.score.toFixed(0).toString()}`,
        {
          font: "25px Arial",
          fill: "#000000"
        }
      );
    }
    console.log(`Score: ${this.score} ${this.faceDrop}`);
  }
}
