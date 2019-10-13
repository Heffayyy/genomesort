// base scene
// anything common across the entire game goes here
class Base extends Phaser.Scene {
  constructor() {
    super()
  }

  preload() {
  }

  create() {
  }

  update() {
  }
}

// level scene
class Level extends Base {

  constructor() {
    super()
  }

  preload() {
    super.preload()
    this.load.image('gnome', 'assets/gnome.png');
    this.load.image('gene', 'assets/gene.png');
  }

  create() {
    super.preload()
    this.player = this.physics.add.image(400, 300, 'gnome');
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.genes = this.physics.add.staticGroup({
      key: 'gene',
      repeat: 9,
      setXY: { x: 120, y: 60, stepY: 70 },
    });

    function make_array(length) {
      // https://stackoverflow.com/a/5836921/4400820
      function shuffle(a) {
        let tmp, current, top = array.length;
        if(top) while(--top) {
          current = Math.floor(Math.random() * (top + 1));
          tmp = array[current];
          array[current] = array[top];
          array[top] = tmp;
        }
        return array;
      }
      let array = []
      for (let i = 0; i < length; ++i) {
        array[i] = i
      }
      return shuffle(array);
    }

    this.values = make_array(10);

    this.genes.children.iterate(function (gene) {
      // give 'em numbers?
    });

    this.physics.add.overlap(this.player, this.genes, this.swap, null, this);
    this.physics.add.collider(this.player, this.genes);
  }

  update() {
    super.preload()
    this.player_move()
  }

  player_move() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    }
    else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    }
    else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    }
    else {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
    }
  }

  swap(player, gene) {
    // swap one down
  }

  check_sorted() {
    // check if the genes sorted
    return true;
  }

}

//Main Menu Scene
class mainMenu extends Phaser.Scene {

  constructor() {
    super()
  } 

  preload() {
    this.load.image('menu', 'assets/menuBackground.png')
    this.load.image('title', 'assets/GeNome.png')
    this.load.spritesheet('play', 'assets/play2.png',{ frameWidth: 193, frameHeight: 92 })
  }

  create() {
    this.add.image(400, 300, 'menu');
    this.add.image(400, 150, 'title');

    this.startButton = this.add.sprite(400, 310, 'play').setFrame(0).setInteractive();
    this.startButton.on('pointerover', () => {
      this.startButton.setFrame(1);
      console.log("hello");
    }, this);
    this.startButton.on('pointerout', () => {this.startButton.setFrame(0)}, this);
    this.startButton.on('pointerdown', () => {this.scene.start(level1)});
  }

  update() {
  }


}


// declare scenes
let level1 = new Level()
let menu = new mainMenu()

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
    },
  },
  scene: [
    level1,
    // start
    menu,
  ],
};

// start game
let game = new Phaser.Game(config);