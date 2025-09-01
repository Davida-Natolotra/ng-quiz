import { Component, OnInit, OnDestroy } from '@angular/core';
import { Question } from '../../services/question';
import { Router } from '@angular/router';
import { CommonModule, NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-quiz',
  imports: [CommonModule, NgIf, NgForOf],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit, OnDestroy {
  questions: any[] = [];
  currentQuestionIndex: number = 0;
  selectedOption: string = '';
  score: number = 0;
  showResults: boolean = false;

  timer: number = 15; // Time in seconds for each question
  interval: any; // Reference to the timer interval

  constructor(private router: Router, private questionService: Question) {}

  ngOnInit(): void {
    // Fetching the questions from the service
    this.questionService.getQuestions().subscribe((data) => {
      this.questions = data;
      this.startTimer(); // Start the timer when questions are loaded
    });
  }

  ngOnDestroy(): void {
    this.clearTimer(); // Clear the timer when the component is destroyed
  }

  startTimer(): void {
    this.clearTimer(); // Ensure no other timer is running
    this.timer = 15; // Reset the timer for each question
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.nextQuestion(); // Move to the next question if time runs out
      }
    }, 1000);
  }

  clearTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  selectOption(option: string): void {
    this.selectedOption = option;
  }

  nextQuestion(): void {
    // Check if the selected option matches the answer
    console.log('Selected Answer: ', this.selectedOption);
    console.log('Correct Answer: ', this.questions[this.currentQuestionIndex]?.answer);
    if (this.selectedOption === this.questions[this.currentQuestionIndex]?.answer) {
      this.score++;
    }
    console.log('Current Score: ', this.score);

    this.selectedOption = ''; // Reset selected option for next question
    this.currentQuestionIndex++; // Move to next question

    // If all questions are answered, navigate to results page
    if (this.currentQuestionIndex >= this.questions.length) {
      console.log('Navigating to results with score:', this.score);
      this.clearTimer(); // Stop the timer
      this.router.navigate(['/results'], {
        queryParams: { score: this.score, totalQuestions: this.questions.length },
      });
    } else {
      this.startTimer(); // Restart the timer for the next question
    }
  }
}
