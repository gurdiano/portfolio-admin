import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { FilterByIdsPipe } from '../../pipes/filter-by-ids-pipe';
import { ExcludeByIdsPipe } from '../../pipes/exclude-by-ids-pipe';
import { environment } from '../../../environments/environment';
import { AppConfig, ConfigService } from '../../services/data/config-service';
import { SkillService } from '../../services/skills/skill-service';
import { BaseCard } from '../base-card/base-card';

@Component({
  selector: 'app-current-skills',
  imports: [
      AsyncPipe,
      JsonPipe,
      FilterByIdsPipe,
      ExcludeByIdsPipe,
      BaseCard,
  ],
  templateUrl: './current-skills.html',
  styleUrl: './current-skills.css',
})
export class CurrentSkills {
  private skillService = inject(SkillService);
  private configService = inject(ConfigService);

  bucket = environment.bucketUrl;
  technologies = this.skillService.techProgress;
  config = this.configService.config;
}
