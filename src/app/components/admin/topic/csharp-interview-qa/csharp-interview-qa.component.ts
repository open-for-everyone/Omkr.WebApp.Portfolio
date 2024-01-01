import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionEditDialogComponent } from 'src/app/components/general/dialog/topic/question-edit-dialog/question-edit-dialog.component';
import { Question } from 'src/app/models/topic/question';
import { QaDataService } from 'src/app/services/general/qa-data/qa-data.service';

@Component({
  selector: 'app-csharp-interview-qa',
  templateUrl: './csharp-interview-qa.component.html',
  styleUrls: ['./csharp-interview-qa.component.css']
})
export class CsharpInterviewQaComponent implements

  OnInit {
  questions: Question[] = [];
  selectedQuestion: Question | null = null;

  constructor(private questionService: QaDataService,
    public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.questionService.getQuestions().subscribe(data => {
      this.questions = data;
    });
  }

  selectQuestion(question: Question): void {
    this.selectedQuestion = question;
  }

  createQuestion(question: Question): void {
    this.questionService.createQuestion(question).subscribe(() => {
      this.loadQuestions();
    });
  }

  updateQuestion(question: Question): void {
    if (question.id) {
      this.questionService.updateQuestion(question).subscribe(() => {
        this.loadQuestions();
      });
    }
  }

  deleteQuestion(id: string): void {
    this.questionService.deleteQuestion(id).subscribe(() => {
      this.loadQuestions();
    });
  }

  handleKeyUp(event: KeyboardEvent): void {
    // Handle key up event here
  }

  openEditDialog(question?: Question): void {
    // Create copies of tags and references as comma-separated strings
    const editedQuestion = {
      ...question,
      tags: question?.tags.join(', '),
      references: question?.references.join(', ')
    };


    const dialogRef = this.dialog.open(QuestionEditDialogComponent, {
      width: '800px', // Set the desired width for the dialog
      data: editedQuestion // Pass the edited question to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Check if the result has an id to determine if it's a new or existing question
        if (result.id) {
          console.log("result.id: " + result.id);
          // Split tags and references back into arrays before updating
          result.tags = result.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
          result.references = result.references.split(',').map((ref: string) => ref.trim()).filter((ref: string) => ref);
          this.updateQuestion(result); // Update the question with the result from the dialog
        }
        else {
          this.createQuestion(result);
        }
      }
    });
  }
}
