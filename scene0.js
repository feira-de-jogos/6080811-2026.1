class scene0 extends Phaser.Scene {
  constructor() {
    super("scene0");

    this.threshold = 0.1;
    this.speed = 100;
    this.direction = undefined;
  }

  preload() {
    this.load.setPath("assets/");

    this.load.tilemapTiledJSON("map", "map.json");

    this.load.spritesheet("android", "SpaceStation_Android_Sheet.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("character", "SpaceStation_Character_Sheet.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image("objects", "SpaceStation_Objects.png");
    this.load.spritesheet("projectiles", "SpaceStation_Projectiles_Sheet.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image("tileset", "SpaceStation_Tileset.png");
    this.load.spritesheet("turret", "SpaceStation_Turret_Sheet.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.audio("music", "music.mp3");
    this.load.audio("laser", "laser.mp3");

    this.load.plugin(
      "rexvirtualjoystickplugin",
      "../rexvirtualjoystickplugin.min.js",
      true,
    );
  }

  create() {
    this.tilemap = this.make.tilemap({ key: "map" });

    this.tilesetTileset = this.tilemap.addTilesetImage("tileset");
    this.tilesetObjects = this.tilemap.addTilesetImage("objects");
    this.tilesetTurret = this.tilemap.addTilesetImage("turret");
    // this.tilesetCharacter = this.tilemap.addTilesetImage("character");
    // this.tilesetAndroid = this.tilemap.addTilesetImage("android");

    this.layerBackground = this.tilemap.createLayer("background", [
      this.tilesetTileset,
    ]);
    this.layerGround = this.tilemap.createLayer("ground", [
      this.tilesetTileset,
    ]);
    this.layerRoof = this.tilemap.createLayer("roof", [this.tilesetTileset]);
    this.layerWalls = this.tilemap.createLayer("walls", [this.tilesetTileset]);
    this.layerWallsUnder = this.tilemap.createLayer("walls_under", [
      this.tilesetTileset,
    ]);
    this.layerWallsOver = this.tilemap.createLayer("walls_over", [
      this.tilesetTileset,
    ]);
    this.layerLamps = this.tilemap.createLayer("lamps", [this.tilesetTileset]);
    this.layerWindows = this.tilemap.createLayer("windows", [
      this.tilesetTileset,
    ]);
    this.layerObjects = this.tilemap.createLayer("objects", [
      this.tilesetTileset,
    ]);
    // this.layerCharacter = this.tilemap.createLayer("character", [
    //   this.tilesetCharacter,
    // ]);
    // this.layerEnemy = this.tilemap.createLayer("enemy", [this.tilesetAndroid]);
    this.layerPlatform = this.tilemap.createLayer("platform", [
      this.tilesetTileset,
    ]);
    this.layerShelf = this.tilemap.createLayer("shelf", [this.tilesetTileset]);

    this.player = this.physics.add.sprite(150, 600, "character", 0);

    this.layerTeletransport = this.tilemap.createLayer("teletransport", [
      this.tilesetTileset,
    ]);

    this.anims.create({
      key: "standing-still",
      frames: this.anims.generateFrameNumbers("character", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "running",
      frames: this.anims.generateFrameNumbers("character", {
        start: 8,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "jumping",
      frames: this.anims.generateFrameNumbers("character", {
        start: 40,
        end: 47,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.physics.world.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels,
    );
    this.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels,
    );
    this.cameras.main.startFollow(this.player);

    this.player.setCollideWorldBounds(true);

    this.layerGround.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, this.layerGround);

    this.layerRoof.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, this.layerRoof);

    this.layerWalls.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, this.layerWalls);

    this.layerWallsUnder.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, this.layerWallsUnder);

    this.layerWallsOver.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, this.layerWallsOver);

    this.layerLamps.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, this.layerLamps);

    this.layerPlatform.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, this.layerPlatform);
    this.layerPlatform.forEachTile((tile) => {
      if (tile.properties.collides) {
        //left, right, up, down
        tile.setCollision(false, false, true, false);
      }
    });

    this.music = this.sound.add("music", { loop: true }).play();
    this.laser = this.sound.add("laser");

    this.joystick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 100,
      y: 350,
      radius: 50,
      base: this.add.circle(0, 0, 50, 0xcccccc),
      thumb: this.add.circle(0, 0, 25, 0x666666),
    });

    this.joystick.on("update", () => {
      const angle = Phaser.Math.DegToRad(this.joystick.angle);
      const force = this.joystick.force;

      if (force > this.threshold) {
        this.direction = new Phaser.Math.Vector2(
          Math.cos(angle),
          Math.sin(angle),
        ).normalize();
      }

      if (this.joystick.force > 0) {
        switch (true) {
          // jump
          case this.joystick.angle >= -110 &&
            this.joystick.angle < -50 &&
            this.player.body.blocked.down:
            this.player.setVelocityY(-150);
            this.player.anims.play("jumping", true);
            break;
          // right
          case this.joystick.angle >= -20 && this.joystick.angle < 20:
            this.player.flipX = false;
            this.player.setVelocityX(200);
            if (this.player.body.blocked.down) {
              this.player.anims.play("running", true);
            }
            break;
          // left
          case this.joystick.angle >= 160 || this.joystick.angle < -160:
            this.player.flipX = true;
            this.player.setVelocityX(-200);
            if (this.player.body.blocked.down) {
              this.player.anims.play("running", true);
            }
            break;
        }
      } else {
        this.player.setVelocityX(0);
      }
    });
  }

  update() {
    if (
      this.player.body.velocity.x === 0 &&
      this.player.body.velocity.y === 0 &&
      this.player.body.blocked.down
    ) {
      this.player.anims.play("standing-still", true);
    }
  }
}

export default scene0;
