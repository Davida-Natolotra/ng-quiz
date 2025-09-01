import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-results',
  imports: [CommonModule, RouterLink, NgIf],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results implements OnInit {
  score: number = 0;
  totalQuestions: number = 0;

  constructor(private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    // Accessing query parameters for state
    this.activatedRoute.queryParams.subscribe((params) => {
      this.score = +params['score'] || 0; // '+' converts string to number
      this.totalQuestions = +params['totalQuestions'] || 0;
      console.log('Query Params:', params);
    });
  }

  restartQuiz(): void {
    // Navigate to the quiz start page using routerLink in the HTML
    console.log('Restart Quiz');
  }
}
