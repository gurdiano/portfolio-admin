import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TechnologiesService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private _allTechnologies = signal<TechnologyGetAllResponse[]>([]);

  allTechnologies = this._allTechnologies;

  constructor () {
    this.getAllTechnlogies().subscribe();
  }

  getAllSkills(): Observable<TechnologyGetAllResponse[]> {
    return this.http.get<any>(`${this.apiUrl}Technology/GetAll`);
  }
  
  getAllTechnlogies(): Observable<TechnologyGetAllResponse[]> {
    return this.http.get<TechnologyGetAllResponse[]>(`${this.apiUrl}Technology/GetAll`).pipe(tap(
      res => this._allTechnologies.set(res)
    ));
  } 

  postTechnology(name:string, icon: any | null, id: number | null): Observable<any> {
    const technology = {
      "name": name,
      "iconId": id? id : icon.id
    }

    // return of (12);
    return this.http.post<any>(`${this.apiUrl}Technology`, technology);
  }

}
