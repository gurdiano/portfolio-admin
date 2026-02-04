import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { RoleGetUserRoleProgressResponse } from '../../models/roles/role-get-user-role-progress-response';
import { RolePutUserRoleProgressResponse } from '../../models/roles/role-put-user-role-progress-response';
import { AuthService } from '../auth/auth-service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private authService = inject(AuthService);
  private _userRoleProgress = signal<RoleGetUserRoleProgressResponse[]>([]);

  userRoleProgress = this._userRoleProgress.asReadonly();
  
  constructor () {
    this.getUserRoleProgress().subscribe();
  }

  getUserRoleProgress(): Observable<RoleGetUserRoleProgressResponse[]> {
    const id = this.authService.getUserId();

    return this.http.get<RoleGetUserRoleProgressResponse[]>(`${this.apiUrl}UserRoleProgress/user/${id}`).pipe(
      tap(res => this._userRoleProgress.set(res))
    );
  }

  putUserRoleProgress(value: RolePutUserRoleProgressResponse): Observable<any> {
    value.userId = this.authService.getUserId()!;
    return this.http.put(`${this.apiUrl}UserRoleProgress`, value);
  }
}
