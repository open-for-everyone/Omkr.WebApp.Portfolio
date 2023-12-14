import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  setSessionCookie() {
    const sessionId = this.generateUniqueToken(); // You need to implement this function
    document.cookie = `session_id=${sessionId}; path=/;`;
  }

  setLocalStorageIdentifier() {
    const uniqueId = localStorage.getItem('uniqueId');
    if (!uniqueId) {
      localStorage.setItem('uniqueId', this.generateUniqueToken());
    }
  }

  generateUniqueToken() {
    return crypto.randomUUID(); // This generates a UUID (universally unique identifier)
  }
}
