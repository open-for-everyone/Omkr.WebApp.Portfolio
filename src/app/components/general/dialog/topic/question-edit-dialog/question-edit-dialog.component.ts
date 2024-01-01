import { Component, Inject, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Question } from 'src/app/models/topic/question';
import { QaDataService } from 'src/app/services/general/qa-data/qa-data.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-question-edit-dialog',
  templateUrl: './question-edit-dialog.component.html',
  styleUrls: ['./question-edit-dialog.component.css']
})
export class QuestionEditDialogComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  constructor(
    public dialogRef: MatDialogRef<QuestionEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Question, private questionService: QaDataService) { }

  ngOnInit() {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    // Add the logic to save the question
    console.log(this.data);
    // this.questionService.updateQuestion(this.data.questionId ?? '', this.data).subscribe();
    // Then close the dialog
    this.dialogRef.close(this.data);
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = (event.value || '').trim();

    if (value) {
      this.data.tags.push(value);
    }

    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.data.tags.indexOf(tag);
    if (index >= 0) {
      this.data.tags.splice(index, 1);
    }
  }

  addReference(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.data.references.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  removeReference(ref: string): void {
    const index = this.data.references.indexOf(ref);
    if (index >= 0) {
      this.data.references.splice(index, 1);
    }
  }
}
