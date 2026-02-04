import { Component, inject } from '@angular/core';
import { BaseCard } from '../base-card/base-card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TechnologiesService } from '../../services/technologies/technologies-service';
import { FilterInput } from '../filter-input/filter-input';
import { environment } from '../../../environments/environment';
import { ProjectPostResponse } from '../../models/projects/project-post-response';
import { ProjectService } from '../../services/projects/project-service';
import { map, switchMap } from 'rxjs';
import { ErrorResponseBody, ResponseMsg, SuccessResponseBody } from '../response-msg/response-msg';

@Component({
  selector: 'app-create-project',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButton,
    
    ReactiveFormsModule,

    BaseCard,
    FilterInput,
    ResponseMsg,
  ],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css',
})
export class CreateProject {
  private formBuilder = inject(FormBuilder);
  private techService = inject(TechnologiesService);
  private projectService = inject(ProjectService);

  technologyOptions = this.techService.allTechnologies;
  bucket = environment.bucketUrl;
  success: null | SuccessResponseBody = null;
  error: null | ErrorResponseBody = null;

  projectForm = this.formBuilder.group({
    icon: [''],
    name: ['', Validators.required],
    description: [''],
    projectConfig: ['', Validators.required],
    photos: [[] as File[]],
    technologies: ['']
  });

  // submit
  onSubmit() {
    const techIds = this.selectedTechnologies.map(tech => tech.id);
    const selectedImages = this.selectedPhotos.map(obj => obj.file);
    const value = this.projectForm.value;

    const project: ProjectPostResponse = {
      name : value.name!,
      description : value.description!,
      config : value.projectConfig!,
      icon : value.icon!,
      images : selectedImages,
      technologyIds : techIds
    }
    this.projectService.postProject(project).pipe(
      switchMap(postResponse => 
        this.projectService.getByUserId().pipe(
          map(() => postResponse)
        )
      )
    ).subscribe({
      next: (response) => {
        this.success = { mesage: `The Project has been created, Project {id: ${response}}`, response: response }
        this.reset();
      },
      error: (response) => {
        this.error = { mesage: `Failed to create`, error: response }
      }
    });
  }

  reset() {
    this.selectedTechnologies = [];
    this.selectedPhotos = [];
    this.iconFileName = '';
    this.iconFileImage = null;

    this.projectForm.patchValue({ 
      icon : '',
      name : '',
      description: '',
      projectConfig: '',
      photos: [],
      technologies: ''
    });
  }

  // FileInput Icon
  iconFileName = ''
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

  // FileInput Photos + DragArea
  isDragging = false;
  selectedPhotos: any[] = [];
  onDragOver(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
      this.isDragging = true;
  }
  onDragLeave() {
      this.isDragging = false;
  }
  onDrop(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
      this.isDragging = false;

      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
          this.handleFile(files);
      }
  }
  onFileSelected(event: any) {
      const files = event.target.files;
      if (files) this.handleFile(files);
  }
  private handleFile(files: FileList) {
    this.selectedPhotos = [];
    for (const file of files) {
      const reader = new FileReader();
      const fileName = file.name;

      reader.onload = () => {
        this.selectedPhotos.push({
          name: fileName,
          img: reader.result,
          file: file
        })
      }
      reader.readAsDataURL(file);
    }
    this.projectForm.patchValue({ photos : this.selectedPhotos });
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
}
