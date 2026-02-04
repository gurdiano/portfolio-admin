import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { BaseCard } from '../base-card/base-card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { TechnologiesService } from '../../services/technologies/technologies-service';
import { environment } from '../../../environments/environment';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { FilterInput } from '../filter-input/filter-input';
import { ProjectService } from '../../services/projects/project-service';
import { RoleService } from '../../services/roles/role-service';
import { RolePutUserRoleProgressResponse } from '../../models/roles/role-put-user-role-progress-response';
import { ErrorResponseBody, ResponseMsg, SuccessResponseBody } from '../response-msg/response-msg';

@Component({
  selector: 'app-edit-roles',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButton,

    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,

    JsonPipe,
    AsyncPipe,

    BaseCard,
    FilterInput,
    ResponseMsg
  ],
  templateUrl: './edit-roles.html',
  styleUrl: './edit-roles.css',
})
export class EditRoles {
  private techService = inject(TechnologiesService);

  private projectService = inject(ProjectService);
  private roleService = inject(RoleService);
  private formBuilder = inject(FormBuilder);
  
  bucket = environment.bucketUrl;
  projectOptions = this.projectService.allProjects;
  roleOptions = this.roleService.userRoleProgress;
  success: null | SuccessResponseBody = null;
  error: null | ErrorResponseBody = null;
  resetMsg = false;

  roleForm = this.formBuilder.group({
    role: ['', Validators.required],
    level: [0 as number | null],
  });
  
  
  // submit
  onSubmit() {
    const projectIds = this.linkedProjects.map(project => project.id);
    const value = this.roleForm.value;
    const obj: any = value.role;

    const role: RolePutUserRoleProgressResponse = {
      progress: value.level!,
      projectIds: projectIds,
      roleId: obj.roleId
    }
    this.roleService.putUserRoleProgress(role).pipe(switchMap(putResponse => 
      this.roleService.getUserRoleProgress().pipe(map(() => putResponse))
    )).subscribe({
      next: (response) => {
        this.success = { mesage: `The Role has been edited, Role { name: ${obj.role.name} }`, response: response };
        this.reset();
      },
      error: (response) => {
        this.error = { mesage: 'Failed to edit', error: response };
      },
    });
  }
  reset() {
    this.item_progress.set(0);
    this.linkedProjects = [];

    this.roleForm.patchValue({ role: '' });
    this.roleForm.patchValue({ level: 0 });
  }

  // role input 
  handleRoleSelection(itemSelected: any) {
    const isValid = itemSelected && typeof itemSelected === 'object' && 'role' in itemSelected;

    if (isValid){
      this.resetMsg = true;

      this.linkedProjects = itemSelected.projects;
      this.item_progress.set(itemSelected.progress);

      this.roleForm.patchValue({ role: itemSelected });
      this.roleForm.patchValue({ level: itemSelected.progress });
    }
    else {
      this.resetMsg = false;
      this.reset();
    }
  }

  // progress bar
  item_progress = signal(0);
  barContainer = viewChild<ElementRef<HTMLDivElement>>('barContainer');
  updateProgress(event: MouseEvent) {
    const container = this.barContainer()?.nativeElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left; 
    const width = rect.width;
    
    let percentage = Math.round((x / width) * 100);
    percentage = Math.max(0, Math.min(100, percentage));
    this.item_progress.set(percentage);

    this.roleForm.patchValue({
      level: this.item_progress() 
    });
  }

  startDragging(event: MouseEvent) {
    this.updateProgress(event);

    const onMouseMove = (moveEvent: MouseEvent) => {
      this.updateProgress(moveEvent);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }


  // linked projects
  linkedProjects: any[] = [];
  handleProjectSelection(itemSelected: any) {
    const isValid = itemSelected && typeof itemSelected === 'object' && 'configJson' in itemSelected;
    const idValid = this.linkedProjects.filter(project => project.id === itemSelected.id);
    if(isValid && idValid.length === 0) this.linkedProjects.push(itemSelected);
  }

  closeOnClick(id: number) {
    this.linkedProjects = this.linkedProjects.filter(project => project.id !== id);
  }
}