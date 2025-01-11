export class Register {
  /** General Purpose registers */
  private registers = new Uint8Array(0x10);
  /**Special Registers */
  private _delayRegister: number = 0;
  private _timerRegister: number = 0;

  public I: number = 0;

  /**16 bit program counter */
  private PC: number = 0;
  /**16 bit stack pointer */
  private SP: number = 0;
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

  get sp() {
    return this.SP;
  }

  set sp(value: number) {
    this.SP = value;
  }

  get delayRegister() {
    return this._delayRegister & 0xf;
  }
  set delayRegister(v: number) {
    this._delayRegister = v & 0xf;
  }

  get timerRegister() {
    return this._timerRegister & 0xf;
  }

  set timerRegister(v: number) {
    this._timerRegister = v & 0xf;
  }
}
