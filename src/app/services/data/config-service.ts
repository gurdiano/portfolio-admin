import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { AuthService } from '../auth/auth-service';


export interface Skill {
  icon: string,
  role: string
}
export interface Skills {
  favorite: Skill[]
}
export interface Experience{
  position: string,
  company: string,
  period: string,
  description: string
}
export interface Education {
  course: string,
  school: string,
  period: string,
  status: string
}
export interface Background {
  subTitle: string,
  P1: string,
  P2: string,
  P3: string
}
export interface About {
  subTitle: string,
  background: Background,
  education: Education[],
  experience: Experience[]
}
export interface AppConfig {
  name: string,
  copyright: string,
  linkedin: string,
  email: string,
  school: string,
  sem: string,
  linkedinUrl: string,
  gitHubUrl: string,
  emailUrl: string,
  facebookUrl: string,
  instagramUrl: string,
  discordUrl: string,
  whatsappUrl: string,
  about: About,
  skills: Skills,
  mainStack: number[],
  secondaryStack: number[],
  roles: number[],
  contactDescription: string
}
export interface UserResponse {
  id? : number,
  name? : string,
  email? : string,
  config? : string,
  configJson? : AppConfig,
  projectNames? : any[]
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;
  private _config = signal<any>({});

  config = this._config.asReadonly();

  constructor() {
    this.getConfig().subscribe();
  }

  getConfig(): Observable<UserResponse> {
    const id = this.authService.getUserId();

    return this.http.get<UserResponse>(`${this.apiUrl}Users/${id}`).pipe(
      tap(res => this._config.set(res.configJson))
    );
  }
}
