import 'phaser';

export class Gabc extends Phaser.GameObjects.Sprite {
  checked: boolean;
  scene: any;
  sentiment: string;

  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key);

    this.scene = scene;
    this.sentiment = key;

    scene.physics.world.enable(this);
    this.checked = false;
  }

  update(time) {
    if (this.detectOverlap(this, this.scene.rectangle)) {
      if (!this.checked) {
        this.checked = true;
        console.time("capture");
        this.takepicture();
      }
    }
  }

  detectOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
  }

  async callCognitiveServices(blob) {
    const url = 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect';
    const apiKey = '';

    const response = await fetch(`${url}?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=emotion`, {
      method: 'post',
      headers: {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": apiKey
      },
      body: blob
    });
    const data = await response.json();
    console.log(data[0].faceAttributes.emotion);
    this.scene.updateScore(data[0].faceAttributes.emotion[this.sentiment],data[0].faceAttributes);    
    console.timeEnd("capture");
    console.log(`${this.sentiment} matches at ${data[0].faceAttributes.emotion[this.sentiment] * 100}%`);
  }

  takepicture() {
    let context = this.scene.canvas.getContext('2d');
    if (this.scene.width && this.scene.height) {
      this.scene.imageCapture.takePhoto()
        .then(blob => {
          this.callCognitiveServices(blob);
        })
        .catch(error => console.log(error));
      this.scene.canvas.width = this.scene.width;
      this.scene.canvas.height = this.scene.height;
      context.drawImage(this.scene.video, 0, 0, this.scene.width, this.scene.height);
    } else {
      console.log("Error occurded");
    }
  }
}