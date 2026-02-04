import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthPostLoginResponse } from '../../models/auth/auth-post-login-response';
import { jwtDecode } from 'jwt-decode';

export interface AuthLoginResponse {
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_ID_KEY = 'user_id_token';

  login(credentials: AuthLoginResponse): Observable<AuthPostLoginResponse> {
    return this.http.post<AuthPostLoginResponse>(`${this.apiUrl}Auth/login`, credentials).pipe(
      tap(res => {
        const decoded: any = jwtDecode(res.token);
        const user_id = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        const tokenJwt = res.token

        localStorage.setItem(this.TOKEN_KEY, tokenJwt);
        localStorage.setItem(this.USER_ID_KEY, user_id);
      })
    );
  }

  logout() {
    localStorage.clear();
    window.location.href= '/login'
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserId() {
    return localStorage.getItem(this.USER_ID_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
