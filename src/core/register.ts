import { hexStr } from "./utils";

export class Register {
  /** General Purpose registers */
  private registers = new Uint8Array(0x10);
  /**Special Registers */
  private _delayTimer: number = 0;
  private _soundTimer: number = 0;

  public I: number = 0;

  /**16 bit program counter */
  private PC: number = 0;
  constructor() {}

  setRegister(index: number, value: number) {
    this.registers[index] = value;
  }
  getRegister(i: number) {
    return this.registers[i];
  }

  get pc() {
    return this.PC;
  }
  set pc(value: number) {
    this.PC = value;
  }

  get delayTimer() {
    return this._delayTimer & 0xf;
  }
  set delayTimer(v: number) {
    this._delayTimer = v & 0xf;
  }

  get soundTimer() {
    return this._soundTimer & 0xf;
  }

  set soundTimer(v: number) {
    this._soundTimer = v & 0xf;
  }
  public reset() {
    this.I = 0;
    this.PC = 0x200;
    this.soundTimer = 0;
    this.delayTimer = 0;
    this.registers.fill(0);
  }

  public dump() {
    const str = `
I: ${this.I}
PC: ${this.PC}
Delay Timer: ${hexStr(this.delayTimer)}
Sound Timer: ${hexStr(this.soundTimer)}
V0: ${hexStr(this.registers[0])}
V1: ${hexStr(this.registers[1])}
V2: ${hexStr(this.registers[2])}
V3: ${hexStr(this.registers[3])}
V4: ${hexStr(this.registers[4])}
V5: ${hexStr(this.registers[5])}
V6: ${hexStr(this.registers[6])}
V7: ${hexStr(this.registers[7])}
V8: ${hexStr(this.registers[8])}
V9: ${hexStr(this.registers[9])}
VA: ${hexStr(this.registers[10])}
VB: ${hexStr(this.registers[11])}
VC: ${hexStr(this.registers[12])}
VD: ${hexStr(this.registers[13])}
VE: ${hexStr(this.registers[14])}
VF: ${hexStr(this.registers[15])}
    `;
    return str;
  }
}
