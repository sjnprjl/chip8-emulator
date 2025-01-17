import { CPU } from "./cpu";
import { Keyboard } from "./keyboard";
import { Memory } from "./memory";
import { Register } from "./register";
import { Sound } from "./sound";
import { Screen } from "./screen";
import { getRom, getRomNames, getRoms } from "../roms";

interface Chip8Options {
  debug?: boolean;
  scale?: number;
  app: HTMLElement;
}

export class Chip8 {
  private cpu?: CPU;
  constructor(private options: Chip8Options) {
    this.options.debug = this.options.debug ?? false;
    this.options.scale = this.options.scale ?? 10;
    this._init();
  }

  private _init() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Canvas not supported");
    this.options.app?.appendChild(canvas);
    const memory = new Memory();
    const register = new Register();
    const screen = new Screen(ctx, this.options.scale);
    const keyboard = new Keyboard();
    const sound = new Sound();

    const cpu = new CPU({ memory, register, screen, keyboard, sound });
    this.cpu = cpu;
    this.cpu.screen.reset();
    this.cpu.pause(); // initally halt the cpu
    if (this.options.debug) this.cpu.debug = this.options.debug;
  }

  public init() {
    this.initUI();
    this.romSelectorInit();
    this.initRegisterUI();
    this.cpu?.run(() => {
      this.updateRegisterUI();
    }); // start the cpu
  }

  private initUI() {
    // buttons
    const playPauseButton = document.getElementById("playPause");
    const resetButton = document.getElementById("reset");
    const stepButton = document.getElementById("step");

    if (this.cpu?.isRunning()) playPauseButton!.textContent = "Pause";
    else playPauseButton!.textContent = "Play";

    playPauseButton?.addEventListener("click", () => {
      if (this.cpu?.isRunning()) {
        this.cpu?.pause();
        playPauseButton!.textContent = "Play";
      } else {
        this.cpu?.resume();
        playPauseButton!.textContent = "Pause";
      }
    });
    resetButton?.addEventListener("click", () => {
      this.cpu?.reset();
    });
    stepButton?.addEventListener("click", () => {
      this.cpu?.pause();
      this.cpu?.step();
    });
  }

  private romSelectorInit() {
    const romSelector = document.getElementById(
      "romSelector"
    ) as HTMLSelectElement;
    const roms = getRoms();
    Object.keys(roms).forEach((rom) => {
      const option = document.createElement("option");
      option.value = rom;
      option.text = rom;
      romSelector?.appendChild(option);
    });

    romSelector?.addEventListener("change", () => {
      const rom = romSelector?.value as keyof typeof roms;
      this.cpu?.reset();
      this.cpu?.resume();
      if (rom) this.loadRom(getRom(rom));
      romSelector.blur();
    });
  }

  private updateRegisterUI() {
    const registerContainer = document.querySelector(
      ".register-container"
    ) as HTMLElement;
    registerContainer.innerHTML = `<pre>${
      this.cpu?.register.dump() ?? ""
    }</pre>`;
  }

  private initRegisterUI() {
    this.updateRegisterUI();
  }

  loadRom(rom: Uint8Array) {
    this.cpu?.load(rom);
  }
}
