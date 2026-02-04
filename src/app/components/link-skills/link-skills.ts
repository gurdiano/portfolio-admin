import { Component, inject } from '@angular/core';
import { BaseCard } from '../base-card/base-card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { SkillService } from '../../services/skills/skill-service';
import { FilterInput } from '../filter-input/filter-input';
import { ProjectService } from '../../services/projects/project-service';
import { environment } from '../../../environments/environment';
import { map, switchMap } from 'rxjs';
import { ErrorResponseBody, ResponseMsg, SuccessResponseBody } from '../response-msg/response-msg';

@Component({
  selector: 'app-link-skills',
  imports: [
    BaseCard,

    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButton,

    FilterInput,
    ResponseMsg,
  ],
  templateUrl: './link-skills.html',
  styleUrl: './link-skills.css',
})
export class LinkSkills {
  private formBuilder = inject(FormBuilder);
  private skillService = inject(SkillService);
  private projectService = inject(ProjectService);

  skillOptions = this.skillService.techProgress;
  projectOptions = this.projectService.allProjects;
  bucket = environment.bucketUrl;
  success: null | SuccessResponseBody = null;
  error: null | ErrorResponseBody  = null;

  linkForm = this.formBuilder.group({
    skill: ['', Validators.required]
  });

  onSubmit() {
    const value: any = this.linkForm.value.skill;
    const projectIds = this.linkedProjects.map(project => project.id);

    const skill: SkillPutResponse = {
      techId : value.techId,
      progress : value.progress,
      projectIds : projectIds
    }
    this.skillService.putUserTechnologyProgress(skill).pipe(
      switchMap(putResponse => this.skillService.getUserTechProgress().pipe(
        map(() => putResponse)
      ))
    ).subscribe({
      next: (response) => {
        this.success = { mesage: `The Skill has been updated, TechProgress{ techId: ${response.techId}, progress: ${response.progress} }`, response: response }
      },
      error: (response) => {
        this.error = { mesage: 'Failed to', error: response };
      }
    });
  } 

  // skill input
  linkedProjects: any[] = [];
  handleSkillSelection(itemSelected: any) {
    const isValid = itemSelected && typeof itemSelected === 'object' && 'tech' in itemSelected;
    if(isValid) {
      this.linkForm.patchValue({ skill: itemSelected });
      this.linkedProjects = itemSelected.projects;
    }
    else {
      this.linkForm.patchValue({ skill: '' });
      this.linkedProjects = [];
    }
  }

  // linked projects
  handleProjectSelection(itemSelected: any) {
    const isValid = itemSelected && typeof itemSelected === 'object' && 'configJson' in itemSelected;
    const idValid = this.linkedProjects.filter(project => project.id === itemSelected.id);
    if(isValid && idValid.length === 0) this.linkedProjects.push(itemSelected);
  }

  closeOnClick(id: number) {
    this.linkedProjects = this.linkedProjects.filter(project => project.id !== id);
  }
}
