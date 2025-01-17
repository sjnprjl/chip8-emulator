import { CPU } from "./core/cpu";
import { Keyboard } from "./core/keyboard";
import { Memory } from "./core/memory";
import { Register } from "./core/register";
import { Screen } from "./core/screen";
import { keypadTest, quirksRom } from "./roms";
import "./style.css";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

if (!ctx) throw new Error("Canvas not supported");

document.getElementById("app")?.appendChild(canvas);

const memory = new Memory();
const register = new Register();
const screen = new Screen(ctx, 10);
const keyboard = new Keyboard();

const cpu = new CPU({ memory, register, screen, keyboard });
cpu.load(quirksRom);
cpu.run();

screen.draw();
