const FONTS = Uint8Array.from([
  ...[0xf0, 0x90, 0x90, 0x90, 0xf0], //  0
  ...[0x20, 0x60, 0x20, 0x20, 0x70], // 1
  ...[0xf0, 0x10, 0xf0, 0x80, 0xf0], // 2
  ...[0xf0, 0x10, 0xf0, 0x10, 0xf0], // 3
  ...[0x90, 0x90, 0xf0, 0x10, 0x10], // 4
  ...[0xf0, 0x80, 0xf0, 0x10, 0xf0], // 5
  ...[0xf0, 0x80, 0xf0, 0x90, 0xf0], // 6
  ...[0xf0, 0x10, 0x20, 0x40, 0x40], // 7
  ...[0xf0, 0x90, 0xf0, 0x90, 0xf0], // 8
  ...[0xf0, 0x90, 0xf0, 0x10, 0xf0], // 9
  ...[0xf0, 0x90, 0xf0, 0x90, 0x90], // A
  ...[0xe0, 0x90, 0xe0, 0x90, 0xe0], // B
  ...[0xf0, 0x80, 0x80, 0x80, 0xf0], // C
  ...[0xe0, 0x90, 0x90, 0x90, 0xe0], // D
  ...[0xf0, 0x80, 0xf0, 0x80, 0xf0], // E
  ...[0xf0, 0x80, 0xf0, 0x80, 0x80], // F
]);

export class Memory {
  private _mem = new Uint8Array(0xfff);

  constructor() {
    this._mem.set(FONTS);
  }

  read(addr: number) {
    return this._mem[addr & 0xfff];
  }
  write(addr: number) {
    this._mem[addr & 0xfff] = 0;
  }

  load(arr: Uint8Array, offset?: number) {
    this._mem.set(arr, offset);
  }
}