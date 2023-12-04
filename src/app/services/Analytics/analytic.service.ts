import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticService {

  sendAnalyticEvent(action: string, category: string, label: string) {
    console.log(action, category, label);
  }

  sendAnalyticPageView(path: string, title: string) {
    console.log(path, title);
  }
}
