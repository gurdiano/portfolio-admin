import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ProjectGetByUserIdResponse } from '../../models/projects/project-get-by-user-id-response';
import { Observable, of, tap } from 'rxjs';
import { ProjectPostResponse } from '../../models/projects/project-post-response';
import { ProjectPutResponse } from '../../models/projects/project-put-response';
import { ProjectPostImageResponse } from '../../models/projects/project-post-image-response';
import { C } from '@angular/cdk/keycodes';
import { AuthService } from '../auth/auth-service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;
  private imageUrl = environment.imageUrl;
  private _allProjects = signal<ProjectGetByUserIdResponse[]>([]);

  allProjects = this._allProjects.asReadonly();

  constructor () {
    this.getByUserId().subscribe();
  }

  getByUserId(): Observable<ProjectGetByUserIdResponse[]> {
    const id = this.authService.getUserId();

    return this.http.get<any>(`${this.apiUrl}Project/GetByUserId/${id}`).pipe(
      tap(res => this._allProjects.set(res))
    );
  }

  postProject(value: ProjectPostResponse): Observable<any> {
    const formData = new FormData();
    const userID = this.authService.getUserId();

    formData.append('Name', value.name);
    formData.append('Description', value.description ?? '');
    formData.append('Config', value.config);
    formData.append('Icon', value.icon ?? '');
    value.images?.forEach(image => {
      formData.append('Images', image);
    });
    formData.append('UserId', userID!);
    value.technologyIds?.forEach(tech => {
      formData.append('TechnologyIds', tech.toString());
    });

    return this.http.post(`${this.apiUrl}Project`, formData);
  }

  putProject(value: ProjectPutResponse): Observable<any> {
    const formData = new FormData();
    const userID = this.authService.getUserId();

    formData.append('Name', value.name);
    formData.append('Description', value.description ?? '');
    formData.append('Config', value.config);
    formData.append('Icon', value.icon ?? '');
    formData.append('UserId', userID!);
    value.technologyIds?.forEach(tech => {
      formData.append('TechnologyIds', tech.toString());
    });

    return this.http.put(`${this.apiUrl}Project/${value.id}`, formData);
  }

  postImage(value: ProjectPostImageResponse): Observable<any> {
    const formData = new FormData();
    value.images.forEach(img => {
        formData.append('images', img);
    });
    return this.http.post(`${this.imageUrl}${value.projectId}`, formData);
  }

  deleteImage(projectId: number, imageUrl: string): Observable<any> {  
    return this.http.delete(`${this.imageUrl}${projectId}/${encodeURIComponent(imageUrl)}`);
  }
}
