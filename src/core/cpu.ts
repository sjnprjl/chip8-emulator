import { Instruction } from "./instruction";
import { Memory } from "./memory";
import { Register } from "./register";
import { toU16 } from "./utils";
import { Screen } from "./screen";
import { Keyboard } from "./keyboard";
import { Sound } from "./sound";

export class CPU {
  public register: Register;
  public memory: Memory;
  public screen: Screen;
  public keyboard: Keyboard;
  private sound: Sound;
  private requestID: number;
  private waitForKeyPressed: boolean = false;
  private IR: number = 0;
  public debug = false;
  private _pause: boolean = false;

  constructor({
    register,
    memory,
    screen,
    keyboard,
    sound,
  }: {
    register: Register;
    memory: Memory;
    screen: Screen;
    keyboard: Keyboard;
    sound: Sound;
  }) {
    this.register = register;
    this.memory = memory;
    this.screen = screen;
    this.requestID = 0;
    this.keyboard = keyboard;
    this.sound = sound;
  }

  private setKeyboardInterrupt() {
    this.keyboard.onPress = (event, key) => {
      if (this.waitForKeyPressed && key && event === "keyup") {
        const x = (this.IR & 0x0f00) >> 8;
        this.register.setRegister(x, key);
        this.waitForKeys(false);
      }
    };
    this.keyboard.listen();
  }

  public pause() {
    this._pause = true;
  }

  public resume() {
    this._pause = false;
  }

  public isRunning() {
    return !this._pause;
  }

  public reset() {
    this.sound.stop();
    this.register.reset();
    this.screen.reset();
  }

  load(arr: Uint8Array) {
    this.register.pc = 0x200;
    this.memory.load(arr, this.register.pc);
  }

  private fetch() {
    const msb = this.memory.read(this.register.pc++);
    const lsb = this.memory.read(this.register.pc++);
    this.IR = toU16(msb, lsb);
    return this.IR;
  }

  private decode(opcode: number) {
    // most significant bit
    const msb = ((opcode & 0xf000) >> 12) as keyof typeof Instruction;
    const instr = Instruction[msb];
    return instr;
  }

  private checkInterrupts(): boolean {
    return this.waitForKeyPressed;
  }

  private tick() {
    const pc = this.register.pc;
    if (this.checkInterrupts()) {
      return;
    }
    const opcode = this.fetch();
    const instr = this.decode(opcode);
    if (this.debug) console.log("opcode " + opcode.toString(16) + ` at ${pc}`);
    if (!instr) {
      cancelAnimationFrame(this.requestID);
      throw new Error("Invalid opcode " + opcode.toString(16) + ` at ${pc}`);
    }
    try {
      instr(this, opcode);
    } catch (err) {
      cancelAnimationFrame(this.requestID);
      throw err;
    }
  }

  public step() {
    if (this.register.delayTimer > 0) {
      this.register.delayTimer--;
    }
    if (this.register.soundTimer > 0) {
      this.sound.play();
      this.register.soundTimer--;
    } else {
      this.sound.stop();
    }
    this.tick();
    this.screen.render();
  }

  private cycle(cb?: () => void) {
    if (!this._pause) {
      if (this.register.delayTimer > 0) {
        this.register.delayTimer--;
      }
      if (this.register.soundTimer > 0) {
        this.sound.play();
        this.register.soundTimer--;
      } else {
        this.sound.stop();
      }
      for (let i = 0; i < 10; i++) {
        this.tick();
      }
    }
    this.screen.render();
    cb?.();
    window.requestAnimationFrame(() => this.cycle(cb));
  }

  run(cb?: () => void) {
    this.setKeyboardInterrupt();
    this.cycle(cb);
  }

  waitForKeys(wait = true) {
    this.waitForKeyPressed = wait;
  }
}
