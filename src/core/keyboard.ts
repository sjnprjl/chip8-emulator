export class Keyboard {
  private keyMaps = new Uint8Array(0x10);
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
      const pressed = parseInt(e.key, 16);
      if (!Number.isNaN(pressed)) cb(pressed);
    });
  }

  isKeyPressed(n: number) {
    if (n < 0 || n > 0xf) throw new Error("Invalid key");
    return this.keyMaps[n];
  }
}
