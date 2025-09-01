import { Component, inject } from '@angular/core';
import { Myrec } from '../../services/myrec';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-recap',
  imports: [RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './recap.html',
  styleUrl: './recap.css',
})
export class Recap {
  MyRecs = inject(Myrec);
  myrecs = this.MyRecs.myrecs();
}
