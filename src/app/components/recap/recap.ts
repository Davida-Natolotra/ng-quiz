import { Component, inject } from '@angular/core';
import { Myrec } from '../../services/myrec';

@Component({
  selector: 'app-recap',
  imports: [],
  templateUrl: './recap.html',
  styleUrl: './recap.css',
})
export class Recap {
  myrecs = inject(Myrec);
}
