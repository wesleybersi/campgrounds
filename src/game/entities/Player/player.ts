import { CELL_SIZE } from "../../../../../../socket-shooter 2/server/src/constants";
import MainScene from "../../scenes/Main/MainScene";
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  SHADOW_ALPHA,
  SHADOW_COLOR,
  SHADOW_SIZE,
  STROKE_COLOR,
} from "../../scenes/Main/constants";
import { getRandomInt } from "../../utils/helper-functions";
import { Bow } from "../Weapon/Bow";
import { Crossbow } from "../Weapon/Crossbow";
import { Spear } from "../Weapon/Spear";
import { Sword } from "../Weapon/Sword";

type Weapon = Bow | Crossbow | Sword | Spear;

const skinColors = [
  0xf9c984, 0xe1b474, 0xc99e65, 0xb18955, 0x987346, 0x805e36, 0x684827,
  0x503317,
];
export class Player extends Phaser.GameObjects.Container {
  state: "Idle" | "Moving" | "Falling" | "Dead" = "Idle";
  scene: MainScene;
  id: string;
  name: string;
  weapon: Weapon | null = null;
  force = 0;
  rotationTween: Phaser.Tweens.Tween | null = null;
  movementTween: Phaser.Tweens.Tween | null = null;
  predictionTween: Phaser.Tweens.Tween | null = null;
  particles?: Phaser.GameObjects.Particles.ParticleEmitter;

  headShadow: Phaser.GameObjects.Arc;
  head: Phaser.GameObjects.Arc;
  rightHand: Phaser.GameObjects.Arc;
  leftHand: Phaser.GameObjects.Arc;
  quiver: Phaser.GameObjects.Arc;

  facing: "up" | "down" = "down";
  color: number;

  constructor(
    scene: MainScene,
    id: string,
    name: string,
    color: number,
    weaponKey: string,
    x: number,
    y: number
  ) {
    super(scene as MainScene, x, y);
    this.scene = scene;

    this.name = name;
    this.id = id;
    this.color = color;
    if (weaponKey) this.changeWeapon(weaponKey);

    this.setDepth(1);

    scene.playersByID.set(this.id, this);
    const skinColor = skinColors[getRandomInt(skinColors.length)];

    const headRadius = 60; //Diameter is radius * 2, so diameter is player size
    const handRadius = 22;
    this.head = scene.add.arc(0, 0, headRadius);
    this.head.setFillStyle(skinColor);

    this.headShadow = scene.add
      .arc(0, 0, headRadius + 16)
      .setFillStyle(SHADOW_COLOR)
      .setAlpha(SHADOW_ALPHA);

    this.leftHand = scene.add.arc(105, -12, handRadius);
    this.leftHand.setFillStyle(skinColor);
    this.leftHand.setDepth(-1);

    this.rightHand = scene.add.arc(105, 12, handRadius);
    this.rightHand.setFillStyle(skinColor);
    this.rightHand.setDepth(10);

    this.quiver = scene.add.arc(-55, 32, handRadius);
    this.quiver.setFillStyle(0xb58540);
    this.quiver.setDepth(2);

    this.head.setStrokeStyle(8, STROKE_COLOR);
    this.leftHand.setStrokeStyle(8, STROKE_COLOR);
    this.rightHand.setStrokeStyle(8, STROKE_COLOR);
    this.quiver.setStrokeStyle(8, STROKE_COLOR);
    this.quiver.setAlpha(0);

    this.head.setDepth(500);

    this.add([
      this.quiver,
      this.headShadow,
      this.leftHand,
      this.rightHand,
      this.head,
    ]);

    scene.add.existing(this);

    this.scene.events.on("clear", this.remove, this);
  }

  update(
    x: number,
    y: number,
    state: "moving" | "falling" | "swimming",
    angle: number,
    force: number,
    weapon: {
      key: string;
      isLoaded?: boolean;
      isAttack?: boolean;
      force?: number;
      position?: string;
    } | null,
    wasHit?: boolean,
    isDead?: boolean
  ) {
    this.force = force;
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

    this.setPosition(x, y);

    this.setAngle(angle);

    if (weapon) {
      this.weapon?.update(x, y, angle, force);
      if (this.weapon?.key !== weapon?.key) this.changeWeapon(weapon.key);

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
    } else {
      this.changeWeapon("");
      this.rightHand.setPosition(45, 45);
      this.leftHand.setPosition(45, -45);
    }
  }

  changeWeapon(key: string) {
    this.weapon?.remove();
    if (key.startsWith("bow")) {
      this.weapon = new Bow(this, key);
    } else if (key.startsWith("crossbow")) {
      this.weapon = new Crossbow(this, key);
    } else if (key.startsWith("spear")) {
      this.weapon = new Spear(this, key, 512);
    } else if (key.startsWith("sword")) {
      this.weapon = new Sword(this, key);
    } else {
      this.weapon = null;
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

  // setAnimations(angle: number) {
  //   switch (this.state) {
  //     case "Moving":
  //     case "Idle":
  //       {
  //         const prefix = this.state.toLowerCase();
  //         const lookUpRange = 35;

  //         if (angle > -90 && angle < 90) {
  //           this.sprite.setScale(1, 1);
  //         } else {
  //           this.sprite.setScale(-1, 1);
  //         }

  //         if (angle > -lookUpRange) {
  //           this.facing = "down";
  //           if (this.sprite.anims.currentAnim?.key !== `${prefix}-front`) {
  //             this.sprite.anims.play(`${prefix}-front`);
  //           }
  //         } else if (angle <= -lookUpRange && angle > -180 + lookUpRange) {
  //           this.facing = "up";
  //           if (this.sprite.anims.currentAnim?.key !== `${prefix}-back`) {
  //             this.sprite.anims.play(`${prefix}-back`);
  //           }
  //         }
  //       }

  //       break;

  //     case "Falling":
  //       if (this.sprite.anims.currentAnim?.key !== "falling") {
  //         this.sprite.anims.play("falling");
  //       }
  //       console.log("FALLING ANIMATIOn");

  //       break;

  //     case "Dead":
  //       if (this.sprite.anims.currentAnim?.key !== "dead") {
  //         this.sprite.anims.play("dead");
  //       }
  //       break;
  //   }
  // }

  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.scene.playersByID.delete(this.id);
    this.movementTween?.destroy();
    this.rotationTween?.destroy();
    // this.hands.destroy();
    this.head.destroy();
    this.leftHand.destroy();
    this.rightHand.destroy();
    this.destroy();
  }
}
