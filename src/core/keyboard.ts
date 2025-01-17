export class Keyboard {
  private keyMaps = new Uint8Array(0x10);

  /**
   * Chip 8 Keyboard    User Keyboard
   * 1 2 3 C            1 2 3 4
   * 4 5 6 D            Q W E R
   * 7 8 9 E            A S D F
   * A 0 B F            Z X C V
   */
  private keyMap = {
    /** */
    1: 0x1,
    2: 0x2,
    3: 0x3,
    4: 0xc,

    q: 0x4,
    w: 0x5,
    e: 0x6,
    r: 0xd,

    /** */
    a: 0x7,
    s: 0x8,
    d: 0x9,
    f: 0xe,

    /** */
    z: 0xa,
    x: 0x0,
    c: 0xb,
    v: 0xf,
  } as const;
  public onPress?: (event: "keyup" | "keydown", n: number) => void;
  constructor() {}

  public listen() {
    this.onKeypress("keydown", (n) => {
      this.keyMaps[n] = 1;
      if (this.onPress) this.onPress("keydown", n);
    });
    this.onKeypress("keyup", (n) => {
      this.keyMaps[n] = 0;
      if (this.onPress) this.onPress("keyup", n);
    });
  }

  private onKeypress(event: "keyup" | "keydown", cb: (n: number) => void) {
    if (event !== "keyup" && event !== "keydown")
      throw new Error("Invalid event");
    addEventListener(event, (e) => {
      const key = this.keyMap[e.key as keyof typeof this.keyMap];
      if (key !== undefined) cb(key);
    });
  }

  isKeyPressed(n: number) {
    if (n < 0 || n > 0xf) throw new Error("Invalid key");
    return this.keyMaps[n];
  }
}
