import { CPU } from "./cpu";
import { getNthBit, toU16 } from "./utils";

export const Instruction = {
  0: (cpu: CPU, opcode: number) => {
    switch (opcode) {
      case 0x0000: {
        console.log("0x0000");
        return;
      }
      case 0x00e0: {
        // clear the display;
        cpu.screen.reset();
        console.log("clear display");
        return;
      }
      case 0x00ee: {
        const c = cpu.memory.read(cpu.register.sp--);
        const p = cpu.memory.read(cpu.register.sp--);
        const pc = toU16(p, c);
        cpu.register.pc = pc;
        console.log("0x00ee");
        return;
      }
      default: {
        const nnn = opcode & 0x0fff;
        cpu.register.pc = nnn;
        console.log("0x0nnn", nnn);
      }
    }
  },
  1: (cpu: CPU, opcode: number) => {
    const nnn = opcode & 0x0fff;
    cpu.register.pc = nnn;
    return;
  },
  2: (cpu: CPU, opcode: number) => {
    const nnn = opcode & 0x0fff;
    cpu.register.pc = nnn;
    return;
  },
  3: (cpu: CPU, opcode: number) => {
    // SE Vx, byte
    // 0x3xkk
    const kk = opcode & 0xff;
    const x = (opcode & 0x0f00) >> 8;
    const vx = cpu.register.getRegister(x);
    if (vx === kk) cpu.register.pc += 2;
  },
  4: (cpu: CPU, opcode: number) => {
    // SNE Vx, byte
    const kk = opcode & 0xff;
    const x = (opcode & 0x0f00) >> 8;
    const vx = cpu.register.getRegister(x);
    if (vx !== kk) cpu.register.pc += 2;
  },
  5: (cpu: CPU, opcode: number) => {
    // SE Vx, Vy
    // 0x5xy0
    const x = (opcode & 0x0f00) >> 8;
    const y = (opcode & 0xf0) >> 4;
    const vx = cpu.register.getRegister(x);
    const vy = cpu.register.getRegister(y);
    if (vx === vy) cpu.register.pc += 2;
  },
  6: (cpu: CPU, opcode: number) => {
    const kk = opcode & 0xff;
    const x = (opcode & 0x0f00) >> 8;
    console.log("6", x, kk);
    cpu.register.setRegister(x, kk);
  },
  7: (cpu: CPU, opcode: number) => {
    const x = (opcode & 0x10) >> 4;
    const kk = opcode & 0xff;
    const vx = cpu.register.getRegister(x) + kk;
    cpu.register.setRegister(x, vx);
  },
  0xa: (cpu: CPU, opcode: number) => {
    const nnn = 0x0fff & opcode;
    cpu.register.I = nnn;
  },
  0xd: (cpu: CPU, opcode: number) => {
    // draw
    const x = (opcode & 0x0f00) >> 8;
    const y = (opcode & 0x00f0) >> 4;
    const n = opcode & 0x000f;
    const vx = cpu.register.getRegister(x);
    const vy = cpu.register.getRegister(y);

    // const sprite = cpu.memory.read(cpu.register.I, n);
    for (let i = 0; i < n; i++) {
      const sprite = cpu.memory.read(cpu.register.I + i);
      for (let j = 0; j < 8; j++) {
        cpu.screen.setPixel(vx + j, vy + i, getNthBit(sprite, 7 - j));
      }
    }
    cpu.screen.draw();
  },
} as const;
