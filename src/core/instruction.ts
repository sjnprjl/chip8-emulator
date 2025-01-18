import { CPU } from "./cpu";
import { getNthBit } from "./utils";

export const Instruction = {
  0: (cpu: CPU, opcode: number) => {
    switch (opcode) {
      case 0x0000: {
        return;
      }
      case 0x00e0: {
        // clear the display;
        cpu.screen.reset();
        return;
      }
      case 0x00ee: {
        const pc = cpu.memory.popStack();
        cpu.register.pc = pc;
        return;
      }
      default: {
        const nnn = opcode & 0x0fff;
        cpu.register.pc = nnn;
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
    cpu.memory.pushToStack(cpu.register.pc);
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
    cpu.register.setRegister(x, kk);
  },
  7: (cpu: CPU, opcode: number) => {
    const x = (opcode & 0x0f00) >> 8;
    const kk = opcode & 0xff;
    const vx = cpu.register.getRegister(x) + kk;
    cpu.register.setRegister(x, vx);
  },
  8: (cpu: CPU, opcode: number) => {
    const lastBit = opcode & 0xf;

    const x = (opcode & 0x0f00) >> 8;
    const y = (opcode & 0x00f0) >> 4;

    const vx = cpu.register.getRegister(x);
    const vy = cpu.register.getRegister(y);

    switch (lastBit) {
      case 0: {
        cpu.register.setRegister(x, vy);
        return;
      }
      case 1: {
        cpu.register.setRegister(x, vx | vy);
        cpu.register.setRegister(0xf, 0);
        return;
      }
      case 2: {
        cpu.register.setRegister(x, vx & vy);
        cpu.register.setRegister(0xf, 0);
        return;
      }
      case 3: {
        cpu.register.setRegister(x, vx ^ vy);
        cpu.register.setRegister(0xf, 0);
        return;
      }
      case 4: {
        cpu.register.setRegister(x, vx + vy);
        if (vx + vy > 255) cpu.register.setRegister(0xf, 1);
        else cpu.register.setRegister(0xf, 0);
        return;
      }
      case 5: {
        cpu.register.setRegister(x, vx - vy);
        if (vx >= vy) cpu.register.setRegister(0xf, 1);
        else cpu.register.setRegister(0xf, 0);
        return;
      }
      case 6: {
        const lsb = vx & 1;
        cpu.register.setRegister(x, vx >> 1);
        cpu.register.setRegister(0xf, lsb);
        return;
      }
      case 7: {
        cpu.register.setRegister(x, vy - vx);
        if (vy >= vx) cpu.register.setRegister(0xf, 1);
        else cpu.register.setRegister(0xf, 0);
        return;
      }
      case 0xe: {
        const lsb = vx >> 7;
        cpu.register.setRegister(x, vx << 1);
        cpu.register.setRegister(0xf, lsb);
        return;
      }
    }
  },
  9: (cpu: CPU, opcode: number) => {
    const x = (opcode & 0x0f00) >> 8;
    const y = (opcode & 0xf0) >> 4;
    const vx = cpu.register.getRegister(x);
    const vy = cpu.register.getRegister(y);
    if (vx !== vy) cpu.register.pc += 2;
  },
  0xa: (cpu: CPU, opcode: number) => {
    const nnn = 0x0fff & opcode;
    cpu.register.I = nnn;
  },
  0xb: (cpu: CPU, opcode: number) => {
    const nnn = 0x0fff & opcode;
    cpu.register.pc = nnn + cpu.register.getRegister(nnn >> 8);
  },
  0xc: (cpu: CPU, opcode: number) => {
    const x = (opcode & 0x0f00) >> 8;
    const kk = opcode & 0xff;
    const rnd = Math.floor(Math.random() * 255);
    cpu.register.setRegister(x, rnd & kk);
  },
  0xd: (cpu: CPU, opcode: number) => {
    // draw
    const x = (opcode & 0x0f00) >> 8;
    const y = (opcode & 0x00f0) >> 4;
    const n = opcode & 0x000f;
    const vx = cpu.register.getRegister(x) % cpu.screen.getWidth();
    const vy = cpu.register.getRegister(y) % cpu.screen.getHeight();

    cpu.register.setRegister(0xf, 0);
    for (let i = 0; i < n; i++) {
      const sprite = cpu.memory.read(cpu.register.I + i);
      for (let j = 0; j < 8; j++) {
        if (vx + j >= cpu.screen.getWidth() || vy + i >= cpu.screen.getHeight())
          continue;
        const currentPixel = cpu.screen.getPixel(vx + j, vy + i);
        const spritePixel = getNthBit(sprite, 7 - j);
        if (currentPixel && spritePixel) {
          cpu.register.setRegister(0xf, 1);
        }
        cpu.screen.setPixel(
          vx + j,
          vy + i,
          currentPixel ^ spritePixel,
        );
      }
    }
  },
  0xe: (cpu: CPU, opcode: number) => {
    const nn = opcode & 0xff;
    const x = (opcode & 0x0f00) >> 8;
    switch (nn) {
      case 0x9e: {
        // SKP Vx
        const vx = cpu.register.getRegister(x);
        const currentKey = cpu.keyboard.isKeyPressed(vx);

        if (currentKey) cpu.register.pc += 2;
        return;
      }
      case 0xa1: {
        const vx = cpu.register.getRegister(x);
        const currentKey = cpu.keyboard.isKeyPressed(vx);
        if (!currentKey) cpu.register.pc += 2;
        return;
      }
    }
  },
  0xf: (cpu: CPU, opcode: number) => {
    const x = (opcode & 0x0f00) >> 8;

    const kk = opcode & 0xff;
    const vx = cpu.register.getRegister(x);

    switch (kk) {
      case 0x07: {
        cpu.register.setRegister(x, cpu.register.delayTimer);
        return;
      }

      case 0x0a: {
        cpu.waitForKeys();
        break;
      }
      case 0x15: {
        cpu.register.delayTimer = vx;
        return;
      }
      case 0x18: {
        cpu.register.soundTimer = vx;
        return;
      }
      case 0x29: {
        cpu.register.I = vx * 5;
        return;
      }
      case 0x1e: {
        cpu.register.I += cpu.register.getRegister(x);
        return;
      }
      case 0x33: {
        const data = cpu.register.getRegister(x);
        const ones = data % 10;
        const tens = ((data - ones) % 100) / 10;
        const hundreds = (data - ones - tens * 10) / 100;
        cpu.memory.write(cpu.register.I + 0, hundreds);
        cpu.memory.write(cpu.register.I + 1, tens);
        cpu.memory.write(cpu.register.I + 2, ones);
        return;
      }
      case 0x55: {
        for (let i = 0; i <= x; i++) {
          const data = cpu.register.getRegister(i);
          cpu.memory.write(cpu.register.I + i, data);
        }
        return;
      }
      case 0x65: {
        for (let i = 0; i <= x; i++) {
          const data = cpu.memory.read(cpu.register.I + i);
          cpu.register.setRegister(i, data);
        }
        return;
      }
      default: {
        throw new Error("Opcode not implemented " + opcode.toString(16));
      }
    }
  },
} as const;


