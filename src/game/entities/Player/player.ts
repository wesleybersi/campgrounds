import { CELL_SIZE } from "../../../../../../socket-shooter 2/server/src/constants";
import MainScene from "../../scenes/Main/MainScene";
import { CELL_HEIGHT, CELL_WIDTH } from "../../scenes/Main/constants";
import { Bow } from "../Weapon/Bow";
import { Crossbow } from "../Weapon/Crossbow";
import { Spear } from "../Weapon/Spear";
import { Sword } from "../Weapon/Sword";

type Weapon = Bow | Crossbow | Sword | Spear;
export class Player extends Phaser.GameObjects.Container {
  state: "Idle" | "Moving" | "Falling" | "Dead" = "Idle";
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
    weapon: { type: string; tier: string } | null,
    x: number,
    y: number
  ) {
    super(scene as MainScene, x, y);
    this.scene = scene;
    this.name = name;
    this.id = id;
    this.color = color;
    if (weapon) this.changeWeapon(weapon);

    this.sprite = this.scene.add.sprite(0, 0, "player");

    this.setDepth(1);

    this.add([this.sprite]);
    scene.playersByID.set(this.id, this);
    scene.add.existing(this);
    this.createAnimations();
    this.scene.events.on("clear", this.delete, this);
  }

  update(
    x: number,
    y: number,
    state: "moving" | "falling" | "swimming",
    angle: number,
    weapon: {
      type: string;
      tier: string;
      isLoaded?: boolean;
      isAttack?: boolean;
      force?: number;
      position?: string;
    },
    wasHit?: boolean,
    isDead?: boolean
  ) {
    if (state === "falling") {
      this.state = "Falling";
      this.setAnimations(0);
      return;
    }

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

    if (this.weapon && weapon.isAttack) {
      this.weapon.attack(weapon.position);
    }
    if (weapon?.force && weapon.force > 0) {
      if (this.weapon instanceof Spear) {
        this.weapon.hold(weapon.force);
      }
    }

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
      case "Spear":
        this.weapon = new Spear(this, weapon.tier);
        break;
      case "Sword":
        this.weapon = new Sword(this, weapon.tier);
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
    this.sprite.anims.create({
      key: "falling",
      frames: this.sprite.anims.generateFrameNumbers("player", {
        start: 90,
        end: 95,
      }),
      frameRate: 5,
      repeat: 0,
      hideOnComplete: true,
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

      case "Falling":
        if (this.sprite.anims.currentAnim?.key !== "falling") {
          this.sprite.anims.play("falling");
        }
        console.log("FALLING ANIMATIOn");

        break;

      case "Dead":
        if (this.sprite.anims.currentAnim?.key !== "dead") {
          this.sprite.anims.play("dead");
        }
        break;
    }
  }

  delete() {
    this.scene.events.removeListener("clear", this.delete, this);
    this.scene.playersByID.delete(this.id);
    this.movementTween?.destroy();
    this.rotationTween?.destroy();
    // this.hands.destroy();
    this.destroy();
  }
}
