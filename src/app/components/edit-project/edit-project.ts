import { Component, inject } from '@angular/core';
import { BaseCard } from '../base-card/base-card';
import { map, switchMap } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { FilterInput } from '../filter-input/filter-input';
import { ProjectService } from '../../services/projects/project-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ErrorResponseBody, ResponseMsg, SuccessResponseBody } from '../response-msg/response-msg';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TechnologiesService } from '../../services/technologies/technologies-service';
import { ProjectPutResponse } from '../../models/projects/project-put-response';

@Component({
  selector: 'app-edit-project',
  imports: [
    BaseCard,
    AsyncPipe,
    JsonPipe,
    FilterInput,

    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ResponseMsg
  ],
  templateUrl: './edit-project.html',
  styleUrl: './edit-project.css',
})
export class EditProject {
  private projectService = inject(ProjectService);
  private techService = inject(TechnologiesService);
  private formBuilder = inject(FormBuilder);

  projectOptions = this.projectService.allProjects;
  technologyOptions = this.techService.allTechnologies;
  bucket = environment.bucketUrl;
  success: null | SuccessResponseBody = null;
  error: null | ErrorResponseBody = null;
  isProject: boolean = false; 

  projectForm = this.formBuilder.group({
    id: [0],
    icon: [''],
    name: ['', Validators.required],
    description: [''],
    projectConfig: ['', Validators.required],
    technologies: ['']
  });

  // project input
  async handleProjectSelection(itemSelected: any): Promise<any> {
    const isValid = itemSelected && typeof itemSelected === 'object' && 'configJson' in itemSelected;

    if(isValid) {
      this.isProject = true;

      this.projectForm.patchValue({ id : itemSelected.id });
      this.projectForm.patchValue({ name : itemSelected.name });
      this.projectForm.patchValue({ description : itemSelected.description });

      const technologies: any[] = itemSelected.technologies;
      technologies.forEach(tech => {
        this.pushTech(tech);
      })
    }
    else {
      this.reset();
    }
  }

  // submit
  onSubmit() {
    const techIds = this.selectedTechnologies.map(tech => tech.id);
    const value = this.projectForm.value;

    const project: ProjectPutResponse = {
      id: value.id!,
      name : value.name!,
      description : value.description!,
      config : value.projectConfig!,
      icon : value.icon!,
      technologyIds : techIds
    }
    this.projectService.putProject(project).pipe(
      switchMap(postResponse => 
        this.projectService.getByUserId().pipe(
          map(() => postResponse)
        )
      )
    ).subscribe({
      next: (response) => {
        this.success = { mesage: `The Project has been updated`, response: response };
        this.reset();
      },
      error: (response) => {
        this.error = { mesage: `Failed to update`, error: response };
      }
    });
  }
  reset() {
    this.isProject = false;
    this.selectedTechnologies = [];
    this.iconFileName = '';
    this.iconFileImage = null;

    this.projectForm.patchValue({ 
      id : 0,
      icon : '',
      name : '',
      description: '',
      projectConfig: '',
      technologies: ''
     });
  }
  
  // FileInput Icon
  iconFileName = '';
  iconFileImage: string | ArrayBuffer | null = null;
  onIconFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.iconFileImage = reader.result;
      }
      reader.readAsDataURL(file);

      this.iconFileName = file.name;
      this.projectForm.patchValue({ icon: file });
    }
  }

  // FileInput ConfigJson
  configFileName = '';
  onConfigFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.configFileName = file.name;
      this.projectForm.patchValue({ projectConfig: file });
    }
  }
  
  // Input technologies
  selectedTechnologies: any[] = [];
  handleSelection(itemSelected: any) {
    const isValid = itemSelected! && typeof itemSelected === 'object' && 'id' in itemSelected && 'name';
    if (isValid) {
      this.selectedTechnologies.push(itemSelected);
    }
  }
  closeOnClick(id: number) {
    this.selectedTechnologies = this.selectedTechnologies.filter(tech => tech.id !== id);
  }
  private pushTech(itemSelected: any) {
    this.selectedTechnologies.push({
      id: itemSelected.id,
      name: itemSelected.name,
      iconPath: itemSelected.icon.path
    })
  }
}
