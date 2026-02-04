import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private _allIcons = signal<IconGetAllResponse[]>([]);

  allIcons = this._allIcons.asReadonly();

  constructor () {
    this.getAllIcons().subscribe();
  }

  getAllIcons(): Observable<IconGetAllResponse[]> {
    return this.http.get<IconGetAllResponse[]>(`${this.apiUrl}Icons/GetAll`).pipe(tap(
      res => this._allIcons.set(res)
    ));
  }

  postIcon(name: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Icon', image)
    return this.http.post(`${this.apiUrl}Icons`, formData);
  }
}
