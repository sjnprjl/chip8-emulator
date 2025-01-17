export function toU16(msb: number, lsb: number) {
  return ((msb << 8) | lsb) & 0xffff;
}

export function splitU16(val: number) {
  return { msb: val >> 8, lsb: val & 0xff };
}

export function getNthBit(val: number, n: number) {
  return (val >> n) & 1;
}
export function signed(u: number) {
  return u & 0x80 ? u - 256 : u;
}

export function hexStr(val: number) {
  return val.toString(16).padStart(2, "0");
}
