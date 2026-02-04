import { Component, inject } from '@angular/core';
import { Projects } from '../../items/projects/projects';
import { Skills } from '../../items/skills/skills';
import { Roles } from '../../items/roles/roles';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-home',
  imports: [
    Projects,
    Skills,
    Roles
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private authService = inject(AuthService);

  onLogout() {
    this.authService.logout();
  }

}
