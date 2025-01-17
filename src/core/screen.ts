export class Screen {
  private _buffer: Uint8Array;
  private _w: number;
  private _h: number;
  private _color = { bg: "#000", fg: "#fff" };

  constructor(
    private context: CanvasRenderingContext2D,
    private _scale: number = 2
  ) {
    this._w = 64;
    this._h = 32;
    this.context.canvas.width = this._w * this._scale;
    this.context.canvas.height = this._h * this._scale;
    this._buffer = new Uint8Array(this._w * this._h);
  }

  getPixel(x: number, y: number) {
    return this._buffer[y * this._w + x];
  }

  setPixel(x: number, y: number, value: number) {
    this._buffer[y * this._w + x] = value & 0x1;
  }

  reset() {
    this._buffer.fill(0);
    this.context.fillStyle = this._color.bg;
    this.context.fillRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
  }
  draw() {
    for (let y = 0; y < this._h; y++) {
      for (let x = 0; x < this._w; x++) {
        this.context.fillStyle = this._color.bg;
        this.context.fillRect(
          x * this._scale,
          y * this._scale,
          this._scale,
          this._scale
        );
        if (this.getPixel(x, y)) {
          this.context.fillStyle = this._color.fg;
          this.context.fillRect(
            x * this._scale,
            y * this._scale,
            this._scale,
            this._scale
          );
        }
      }
    }
    this.context.fill();
  }

  clear() {
    this.context.fillStyle = this._color.bg;
    this.context.fillRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
  }

  render() {
    this.draw();
  }

  setBg(color: string) {
    this._color.bg = color;
  }
  setFg(color: string) {
    this._color.fg = color;
  }

  getWidth() {
    return this._w;
  }
  getHeight() {
    return this._h;
  }
}
