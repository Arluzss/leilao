import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Isso garante que o serviço seja singleton
})
export class AudioService {
  private audio: HTMLAudioElement | null = null;

  constructor() {}

  playAudio(url: string): void {
    if (!this.audio) {
      this.audio = new Audio(url);
      this.audio.loop = true; // Se quiser que a música continue em loop
      this.audio.volume = 0.4; // Volume de 0 a 1
      this.audio.play();
    }
  }

  stopAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }

  pauseAudio(): void {
    this.audio?.pause();
  }

  resumeAudio(): void {
    this.audio?.play();
  }

  isPlaying(): boolean {
    return this.audio !== null && !this.audio.paused;
  }
}
