import { Instruction } from "./instruction";
import { Memory } from "./memory";
import { Register } from "./register";
import { toU16 } from "./utils";
import { Screen } from "./screen";
import { Keyboard } from "./keyboard";

export class CPU {
  public register: Register;
  public memory: Memory;
  public screen: Screen;
  public keyboard: Keyboard;
  private intervalId: number;
  private waitForKeyPressed: boolean = false;
  private IR: number = 0;
  public debug = false;

  constructor({
    register,
    memory,
    screen,
    keyboard,
  }: {
    register: Register;
    memory: Memory;
    screen: Screen;
    keyboard: Keyboard;
  }) {
    this.register = register;
    this.memory = memory;
    this.screen = screen;
    this.intervalId = 0;
    this.keyboard = keyboard;
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
      clearInterval(this.intervalId);
      throw new Error("Invalid opcode " + opcode.toString(16) + ` at ${pc}`);
    }
    try {
      instr(this, opcode);
    } catch (err) {
      clearInterval(this.intervalId);
      throw err;
    }
  }

  run() {
    this.setKeyboardInterrupt();
    this.intervalId = setInterval(() => {
      this.screen.clear();
      if (this.register.delayTimer > 0) this.register.delayTimer--;
      if (this.register.soundTimer > 0) this.register.soundTimer--;
      for (let i = 0; i < 29368; i++) {
        this.tick();
      }
      this.screen.render();
    }, 1000 / 60);
  }

  waitForKeys(wait = true) {
    this.waitForKeyPressed = wait;
  }
}
