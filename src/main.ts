import { Chip8 } from "./core/chip8";
import { getRom } from "./roms";
import "./style.css";

const chip8 = new Chip8({
  app: document.getElementById("app") as HTMLElement,
});

chip8.loadRom(getRom("opcode test"));

chip8.init();
