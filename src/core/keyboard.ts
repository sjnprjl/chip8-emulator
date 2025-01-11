export class Keyboard {
  private currentKeyDown: number | null = null;
  constructor() {}

  private listen(event: "keyup" | "keydown", cb: (n: number) => void) {
    addEventListener(event, (e) => {
      const pressed = parseInt(e.key, 16);
      if (!Number.isNaN(pressed)) cb(pressed);
    });
  }

  init() {
    this.listen("keydown", (n) => {
      this.currentKeyDown = n;
    });
    this.listen("keyup", (_) => {
      this.currentKeyDown = null;
    });
  }

  getCurrentKeyDown() {
    return this.currentKeyDown;
  }
}
