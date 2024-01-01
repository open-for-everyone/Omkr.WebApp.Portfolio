import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Question } from 'src/app/models/topic/question';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QaDataService {

  private apiUrl = `${environment.awsUserApiBaseUrl}` + '/api/questions';
  private result = Observable.create();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);
  }

  getQuestion(id: string): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/'single'/${id}`);
  }

  createQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, question);
  }

  updateQuestion(question: Question): Observable<void> {
    const url = `${this.apiUrl}/${question.questionId}`;
    console.log(question.questionId);
    console.log(url)

    this.http.put<void>(url, question).subscribe(result => {
      // Display a success message
      this.snackBar.open('Question updated successfully!', 'Close', {
        duration: 10000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });

      this.result = result;
    });
    return this.result;
  }

  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
