import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OuSignals {
  OuSig = signal([]);
  OuLevSig = signal([]);
}
