import { CELL_SIZE } from "../../../../../../socket-shooter 2/server/src/constants";
import MainScene from "../../scenes/Main/MainScene";
import { CELL_HEIGHT, CELL_WIDTH } from "../../scenes/Main/constants";
import { Bow } from "../Weapon/Bow";
import { Crossbow } from "../Weapon/Crossbow";

type Weapon = Bow;
export class Player extends Phaser.GameObjects.Container {
  state: "Idle" | "Moving" | "Dead" = "Idle";
  scene: MainScene;
  id: string;
  name: string;
  weapon: Weapon | null = null;
  sprite!: Phaser.GameObjects.Sprite;
  rotationTween: Phaser.Tweens.Tween | null = null;
  movementTween: Phaser.Tweens.Tween | null = null;
  predictionTween: Phaser.Tweens.Tween | null = null;
  particles?: Phaser.GameObjects.Particles.ParticleEmitter;

  // hands: Hands;
  facing: "up" | "down" = "down";
  color: number;

  constructor(
    scene: MainScene,
    id: string,
    name: string,
    color: number,
    weapon: { type: string; tier: string },
    x: number,
    y: number
  ) {
    super(scene as MainScene, x, y);
    this.scene = scene;
    this.name = name;
    this.id = id;
    this.color = color;
    this.changeWeapon(weapon);

    this.sprite = this.scene.add.sprite(0, 0, "player");

    this.setDepth(1);

    this.add([this.sprite]);
    scene.playersByID.set(this.id, this);
    scene.add.existing(this);
    this.createAnimations();
  }

  update(
    x: number,
    y: number,
    angle: number,
    weapon: { type: string; tier: string; isLoaded?: boolean },
    wasHit?: boolean,
    isDead?: boolean
  ) {
    if (x !== this.x || y !== this.y) {
      this.state = "Moving";
    } else {
      this.state = "Idle";
    }

    if (wasHit) {
      this.scene.emitter.emitBlood(this.x, this.y);
    }

    if (isDead) {
      this.state = "Dead";
    }

    const depth = Math.floor(this.y / CELL_SIZE);
    this.setAnimations(angle);
    this.setPosition(x, y);
    this.setDepth(depth);
    this.sprite.setDepth(depth);
    this.weapon?.update(
      x,
      y,
      angle,
      this.facing === "up" ? depth - 1 : depth + 1
    );

    if (this.weapon?.type !== weapon?.type) this.changeWeapon(weapon);
    if (this.weapon && this.weapon instanceof Crossbow) {
      if (weapon.isLoaded) {
        this.weapon.load();
      } else if (!weapon.isLoaded) {
        this.weapon.unload();
      }
    }
  }
  changeWeapon(weapon: { type: string; tier: string }) {
    this.weapon?.remove();
    switch (weapon.type) {
      case "Bow":
        this.weapon = new Bow(this, weapon.tier);
        break;
      case "Crossbow":
        this.weapon = new Crossbow(this, weapon.tier);
        break;
      default:
        this.weapon = null;
        break;
    }
  }

  isInViewport() {
    const { left, right, top, bottom } = this.scene.cameras.main.worldView;
    if (
      this.x < left - CELL_WIDTH ||
      this.x > right + CELL_WIDTH ||
      this.y < top - CELL_HEIGHT ||
      this.y > bottom + CELL_HEIGHT
    ) {
      return false;
    } else return true;
  }

  createAnimations() {
    this.sprite.anims.create({
      key: "idle-front",
      frames: this.sprite.anims.generateFrameNumbers("player", {
        start: 0,
        end: 7,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "idle-back",
      frames: this.sprite.anims.generateFrameNumbers("player", {
        start: 10,
        end: 17,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "moving-front",
      frames: this.sprite.anims.generateFrameNumbers("player", {
        start: 20,
        end: 25,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "moving-back",
      frames: this.sprite.anims.generateFrameNumbers("player", {
        start: 30,
        end: 35,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "dead",
      frames: this.sprite.anims.generateFrameNumbers("player", {
        start: 80,
        end: 84,
      }),
      frameRate: 5,
      repeat: 0,
    });
  }

  setAnimations(angle: number) {
    switch (this.state) {
      case "Moving":
      case "Idle":
        {
          const prefix = this.state.toLowerCase();
          const lookUpRange = 35;

          if (angle > -90 && angle < 90) {
            this.sprite.setScale(1, 1);
          } else {
            this.sprite.setScale(-1, 1);
          }

          if (angle > -lookUpRange) {
            this.facing = "down";
            if (this.sprite.anims.currentAnim?.key !== `${prefix}-front`) {
              this.sprite.anims.play(`${prefix}-front`);
            }
          } else if (angle <= -lookUpRange && angle > -180 + lookUpRange) {
            this.facing = "up";
            if (this.sprite.anims.currentAnim?.key !== `${prefix}-back`) {
              this.sprite.anims.play(`${prefix}-back`);
            }
          }
        }

        break;

      case "Dead":
        if (this.sprite.anims.currentAnim?.key !== "dead") {
          this.sprite.anims.play("dead");
        }
        break;

        // case "Jumping":
        //   if (this.sprite.anims.currentAnim?.key !== "Jumping") {
        //     this.sprite.anims.play("Jumping");
        //   }

        //   break;
        // case "Falling":
        //   if (this.sprite.anims.currentAnim?.key !== "Falling") {
        //     this.sprite.anims.play("Falling");
        //   }

        //   break;
        // case "Gliding":
        //   if (this.sprite.anims.currentAnim?.key !== "Gliding") {
        //     this.sprite.anims.play("Gliding");
        //   }
        //   break;
        // case "WallClimbing":
        //   if (this.sprite.anims.currentAnim?.key !== "WallClimbing") {
        //     this.sprite.anims.play("WallClimbing");
        //   }
        //   break;
        // case "Climbing":
        //   if (this.sprite.anims.currentAnim?.key !== "Climbing") {
        //     this.sprite.anims.play("Climbing");
        //   }
        //   break;
        // case "Ducking":
        //   if (this.sprite.anims.currentAnim?.key !== "Ducking") {
        //     this.sprite.anims.play("Ducking");
        //   }
        break;
    }
  }

  delete() {
    this.scene.playersByID.delete(this.id);
    this.movementTween?.destroy();
    this.rotationTween?.destroy();
    // this.hands.destroy();
    this.destroy();
  }
}
