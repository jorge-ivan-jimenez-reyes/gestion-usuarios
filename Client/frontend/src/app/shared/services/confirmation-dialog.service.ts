import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  confirm(message: string): Observable<boolean> {
    // In a real application, you might want to use a modal dialog here
    // For simplicity, we're using the built-in confirm function
    return of(window.confirm(message));
  }
}
