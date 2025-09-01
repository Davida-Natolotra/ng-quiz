import { Component, inject } from '@angular/core';
import { Myrec } from '../../services/myrec';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-recap',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './recap.html',
  styleUrl: './recap.css',
})
export class Recap {
  MyRecs = inject(Myrec);
  private router = inject(Router);
  myrecs = this.MyRecs.myrecs();

  restartQuiz() {
    this.MyRecs.myrecs.set([]);
    this.router.navigate(['']);
  }
}
