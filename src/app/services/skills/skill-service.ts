import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/auth-service';

export interface TechProgressResponse {
  userId: number | string,
  techId: number,
  progress: number, 
  tech: {
    id: number,
    name: string,
    iconPath: string,
  },
  projects: any[]
}

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;
  private _techProgress = signal<TechProgressResponse[]>([]);

  techProgress = this._techProgress.asReadonly();
  
  constructor () {
    this.getUserTechProgress().subscribe();
  }

  oldGetUserTechProgress(): Observable<[TechProgressResponse]> {
    const id = this.authService.getUserId();
    return this.http.get<any>(`${this.apiUrl}UserTechnologyProgress/user/${id}`);
  }

  getUserTechProgress(): Observable<TechProgressResponse[]> {
    const id = this.authService.getUserId();
    return this.http.get<any>(`${this.apiUrl}UserTechnologyProgress/user/${id}`).pipe(tap(
      res =>  this._techProgress.set(res)
    ));
  }

  postUserTechnologyProgress(value: SkillPostResponse): Observable<any> {
    value.userId = this.authService.getUserId()!;
    return this.http.post(`${this.apiUrl}UserTechnologyProgress`, value);
  }

  putUserTechnologyProgress(value: SkillPutResponse): Observable<any> {
    value.userId = this.authService.getUserId()!;
    return this.http.put(`${this.apiUrl}UserTechnologyProgress`, value);
  }

  deleteUserTechnologyProgress(techId: SkillPostResponse): Observable<any> {
    const id = this.authService.getUserId();
    return this.http.delete(`${this.apiUrl}UserTechnologyProgress/${id}/${techId}`);
  }
  
  getSkill(techId: number): any {
    const id = this.authService.getUserId();
    return this.techProgress().find(obj => obj.techId == techId && obj.userId == id!);
  }
}
