export class Sound {
  private audioContext: AudioContext;
  private oscillator?: OscillatorNode;
  private isPlaying: boolean = false;

  constructor() {
    this.audioContext = new AudioContext();
  }

  play() {
    if (this.isPlaying) return;
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.connect(this.audioContext.destination);
    this.oscillator.type = "square";
    this.oscillator.start();
    this.isPlaying = true;
  }

  stop() {
    if (!this.isPlaying) return;
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
    }
    this.isPlaying = false;
  }
}
