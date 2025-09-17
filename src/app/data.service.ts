import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);

  getHello() {
    return this.http.get(environment.apiUrl, {responseType: 'text'});
  }

  // TODO: drop the subscribe here, and change responseType if needed
  updatePosition(x: number, y: number) {
    return this.http.post(`${environment.apiUrl}/position`, { x, y }, { responseType: 'text' }).subscribe({
      next: (response) => console.log('Position updated successfully', response),
      error: (error) => console.error('Error updating position', error)
    });
  }
}
