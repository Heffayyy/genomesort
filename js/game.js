var style = {
  // font: "32px Arial"
  // fill: "#ff0044"
  // wordWrap: true
  // wordWrapWidth: sprite.width
  // align: "center"
  // backgroundColor: "#ffff00"
}

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

  constructor(scene) {
    super()
    this.next_scene = scene;
  }

  preload() {
    super.preload()
    this.load.image('wall', 'assets/wall.png');
    this.load.image('bg', 'assets/bg.png');
    this.load.image('gnome', 'assets/gnome.png');
    this.load.image('gene', 'assets/gene.png');
    this.load.image('arrow', 'assets/arrow.png');
  }

  create() {
    super.preload()
    this.add.image(400, 300, 'bg');
    this.add.text(575, 50, 'Sort (descending)!', {
      fill: "#000000",
    });
    this.add.image(46/2, 565/2+10, 'arrow');
    this.player = this.physics.add.image(400, 300, 'gnome');
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wall = this.physics.add.staticImage(438 * 3/2, 300, 'wall');

    this.genes = [];

    {
      let x0 = 120;
      let y0 = 40;
      let dy = 60;
      let y = y0;
      for (let i = 0; i < 10; ++i) {
        this.genes.push(this.physics.add.staticImage(x0, y, 'gene'));
        y += dy;
      }
    }

    function make_array(length) {
      // https://stackoverflow.com/a/5836921/4400820
      function shuffle(a) {
        let tmp, current, top = a.length;
        if(top) while(--top) {
          current = Math.floor(Math.random() * (top + 1));
          tmp = a[current];
          a[current] = a[top];
          a[top] = tmp;
        }
        return a;
      }
      let array = []
      for (let i = 0; i < length; ++i) {
        array[i] = i
      }
      return shuffle(array);
    }

    this.values = make_array(10);
    this._gene_vals = [];

    for (let i = 0 ; i < this.genes.length; ++i) {
      let gene = this.genes[i];
      gene.name = "gene" + i;
      gene.setData('number', this.values[i]);
      let text = this.add.text(0, 0, ""+gene.getData('number'), {
        fill: "#000000",
      })
      gene.setData('text', text);
    }

    this.physics.add.collider(this.player, this.genes, this.swap, null, this);
    this.physics.add.collider(this.player, this.wall);
  }

  update() {
    super.preload()
    this.player_move()
    this._gene_vals = [];
    for (let i = 0 ; i < this.genes.length; ++i) {
      let gene = this.genes[i];
      let text = gene.getData('text');
      text.x = Math.floor(gene.x + gene.width / 2);
      text.y = Math.floor(gene.y - 20);
      this._gene_vals.push(gene.getData('number'));
    }
    if (this.check_sorted()) {
      // do something useful
      // console.log('sorted');
      this.scene.start(this.next_scene);
    }
  }

  player_move() {
    let moving = false;
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      moving = true;
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      moving = true;
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
      moving = true;
    }
    else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
      moving = true;
    }

    if (!moving) {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
    }
  }

  // swap one down
  swap(player, gene) {
    // stop further hits, no matter what
    player.x += 20;

    let swap_i = null;
    for (let i = 1 ; i < this.genes.length; ++i) {
      let g = this.genes[i];
      if (g.name === gene.name) {
        swap_i = i-1;
        break;
      }
    }

    if (swap_i === null) return;

    {
      let temp = gene.getData('text');
      gene.setData('text', this.genes[swap_i].getData('text'));
      this.genes[swap_i].setData('text', temp);
    }
    {
      let temp = gene.getData('number');
      gene.setData('number', this.genes[swap_i].getData('number'));
      this.genes[swap_i].setData('number', temp);
    }

  }

  check_sorted() {
    // check if the genes sorted
    for (let i = 0; i < this._gene_vals.length-1; ++i) {
      if (this._gene_vals[i] > this._gene_vals[i+1])
        return false;
    }
    return true;
  }

}

//Main Menu Scene
class MainMenu extends Base {

  constructor() {
    super()
  } 

  preload() {
    super.preload();
    this.load.image('menu', 'assets/menuBackground.png')
    this.load.image('title', 'assets/GeNOME.png')
    this.load.spritesheet('play', 'assets/play2.png', { frameWidth: 193, frameHeight: 92 })
    this.load.spritesheet('help', 'assets/howtobuttons.png', {frameWidth: 251, frameHeight: 92 })
    this.load.spritesheet('about', 'assets/about.png', {frameWidth: 193, frameHeight: 92})
  }

  create() {
    super.create();
    this.add.image(400, 300, 'menu');
    this.add.image(400, 150, 'title');

    // implementation for "Play" button
    this.startButton = this.add.sprite(400, 310, 'play').setFrame(0).setInteractive();
    this.startButton.on('pointerover', () => {
      this.startButton.setFrame(1);
    }, this);
    this.startButton.on('pointerout', () => {this.startButton.setFrame(0)}, this);
    this.startButton.on('pointerdown', () => {this.scene.start(level1)});

    // implementation for "How to Play" Button
    this.helpButton = this.add.sprite(400, 405, 'help').setFrame(0).setInteractive();
    this.helpButton.on('pointerover', () => {
      this.helpButton.setFrame(1);
    }, this);
    this.helpButton.on('pointerout', () => {this.helpButton.setFrame(0)}, this);
    this.helpButton.on('pointerdown', () => {window.open('help.html')});

    // Implementation for the "About" Button
    this.aboutButton = this.add.sprite(400, 500, 'about').setFrame(0).setInteractive();
    this.aboutButton.on('pointerover', () => {
      this.aboutButton.setFrame(1);
    }, this);
    this.aboutButton.on('pointerout', () => {this.aboutButton.setFrame(0)}, this);
    this.aboutButton.on('pointerdown', () => {this.scene.start(about)});
  }

  update() {
    super.update();
  }


}

class AboutScreen extends Base {

  constructor(menu) {
    super();
    this._menu = menu;
  }

  preload() {
    super.preload();
    this.load.image('menu', 'assets/menuBackground.png');
    
    // this.load.spritesheet('about', 'assets/about.png', {frameWidth: 193, frameHeight: 92});   
    // this.load.image('aboutPanel', 'assets/aboutPanel.png');
    // this.load.image('back', 'assets/backButton.png', {frameWidth: 186, frameHeight: 203});
  }

  create() {
    super.create();
    this.add.image(400, 300, 'menu');
    // this.add.image(400, 450, 'aboutPanel')
    // this.aboutButton = this.add.sprite(400, 100, 'about').setFrame(0).setInteractive();    

    // this.backButton = this.add.sprite(50, 345, 'back').setFrame(0).setInteractive()
    // this.backButton.on('pointerover', () => {
    //   this.backButton.setFrame(1);
    // }, this);
    // this.backButton.on('pointerout', () => {this.backButton.setFrame(0)}, this);
    // this.backButton.on('pointerdown', () => {this.scene.start(menu)});
  }

  update() {
    super.update()
  }

}


class CongratzScreen extends Base {

  constructor(scene) {
    super();
    this.next = scene;
  }

  preload(){
    super.preload()
    this.load.image('congratz', 'assets/congratsBack.png')
    this.load.image('congratzMessage', 'assets/congratsTEXT.png')
    this.load.spritesheet('next', 'assets/nextButton.png', {frameWidth: 193, frameHeight: 92})
  }

  create() {
    super.create()
    this.add.image(400, 300, 'congratz');
    this.add.image(400, 150, 'congratzMessage')
    this.nextButton = this.add.sprite(400, 500, 'next').setFrame(0).setInteractive();
    this.nextButton.on('pointerover', () => {
      this.nextButton.setFrame(1);
    }, this);
    this.nextButton.on('pointerout', () => {this.nextButton.setFrame(0)}, this);
    this.nextButton.on('pointerdown', () => {this.scene.start(this.next)});
  }

  update() {
    super.update()
  }

}

// declare scenes
let menu = new MainMenu()
let about = new AboutScreen(menu);
let congrat5 = new CongratzScreen(menu);
let level5 = new Level(congrat5);
let congrat4 = new CongratzScreen(level5);
let level4 = new Level(congrat4);
let congrat3 = new CongratzScreen(level4);
let level3 = new Level(congrat3);
let congrat2 = new CongratzScreen(level3);
let level2 = new Level(congrat2);
let congrat1 = new CongratzScreen(level2);
let level1 = new Level(congrat1)

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
    },
  },
  scene: [
    level1,
    level2,
    level3,
    level4,
    level5,
    congrat1,
    congrat2,
    congrat3,
    congrat4,
    congrat5,
    about,
    // start
    menu,
  ],
};

// start game
let game = new Phaser.Game(config);
