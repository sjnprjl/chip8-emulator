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
}
