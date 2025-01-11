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

  load(arr: Uint8Array) {
    this.register.pc = 0x200;
    this.memory.load(arr, this.register.pc);
  }

  private fetch() {
    const msb = this.memory.read(this.register.pc++);
    const lsb = this.memory.read(this.register.pc++);
    return toU16(msb, lsb);
  }

  private decode(opcode: number) {
    const first = ((opcode & 0xf000) >> 12) as keyof typeof Instruction;
    const instr = Instruction[first];
    return instr;
  }

  private tick() {
    const pc = this.register.pc;
    const opcode = this.fetch();
    const instr = this.decode(opcode);
    console.log("opcode " + opcode.toString(16) + ` at ${pc}`);
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
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000 / 60);
  }
}
