import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { Myrec } from '../../services/myrec';

@Component({
  selector: 'app-results',
  imports: [CommonModule, RouterLink, NgIf],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results implements OnInit {
  score: number = 0;
  totalQuestions: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private MyRecs: Myrec
  ) {}
  ngOnInit(): void {
    // Accessing query parameters for state
    this.activatedRoute.queryParams.subscribe((params) => {
      this.score = +params['score'] || 0; // '+' converts string to number
      this.totalQuestions = +params['totalQuestions'] || 0;
      console.log('Query Params:', params);
    });
  }

  restartQuiz() {
    this.MyRecs.myrecs.set([]);
    this.router.navigate(['']);
  }
}
