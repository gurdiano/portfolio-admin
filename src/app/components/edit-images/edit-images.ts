import { Component, inject } from '@angular/core';
import { BaseCard } from '../base-card/base-card';
import { JsonPipe } from '@angular/common';
import { FilterInput } from '../filter-input/filter-input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorResponseBody, ResponseMsg, SuccessResponseBody } from '../response-msg/response-msg';
import { ProjectService } from '../../services/projects/project-service';
import { environment } from '../../../environments/environment';
import { ProjectPostImageResponse } from '../../models/projects/project-post-image-response';
import { lastValueFrom } from 'rxjs';

interface ProjectImage {
  url? : string,
  name? : string,
  img? : any,
  file? : any
}

@Component({
  selector: 'app-edit-images',
  imports: [
    BaseCard,
    JsonPipe,
    FilterInput,

    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ResponseMsg
  ],
  templateUrl: './edit-images.html',
  styleUrl: './edit-images.css',
})
export class EditImages {
  private projectService = inject(ProjectService);
  private projectID = 0;

  projectOptions = this.projectService.allProjects;
  bucket = environment.bucketUrl;
  resetResponse: boolean = false;
  isProject: boolean = false;
  success: null | SuccessResponseBody = null;
  error: null | ErrorResponseBody = null;

  // Submit 
  async onSubmit(){
    const toAdd = this.getToAdd();
    const postResponse: ProjectPostImageResponse = { projectId : this.projectID, images : toAdd}

    const posts$ = this.projectService.postImage(postResponse);

    const add = toAdd.length > 0;
    const remove = this.toRemove.length > 0;

    if (add || remove) {
      try {
        const deletes = [];
        const uploads = [];
  
        if (add) uploads.push(await lastValueFrom(posts$));
  
        for(const item of this.toRemove) {
          const delete$ = this.projectService.deleteImage(this.projectID, item.url!);
          deletes.push(await lastValueFrom(delete$));
        }
        await lastValueFrom (this.projectService.getByUserId());
  
        this.success = {mesage: 'The Photos has been updated', response: [...deletes]};
        this.reset()
      }catch (error) {
        this.error = {mesage: 'Failed to update', error: error};
      }
    }
  }

  reset() {
    this.selectedPhotos = [];
    this.toRemove = [];
    this.projectID = 0;
  }

  // Project input
  handleProjectSelection(itemSelected: any) {
    this.reset();
    const isValid = itemSelected && typeof itemSelected === 'object' && 'configJson' in itemSelected;

    if(isValid){
      this.isProject = true;
      this.projectID = itemSelected.id;

      const images: string[] = itemSelected.images;

      images.forEach(url => {
        this.selectedPhotos.push({ 
          url : url,
          name : url,
        });
      });
      this.resetResponse = true;
    }
    else {
      this.isProject = false;
      this.resetResponse = false;
    }
  }

  // FileInput Photos + DragArea
  isDragging = false;
  selectedPhotos: ProjectImage[] = [];
  toRemove: ProjectImage[] = [];

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
    for (const file of files) {
      const reader = new FileReader();
      const fileName = file.name;

      reader.onload = () => {
        this.selectedPhotos.push({
          url : '',
          name: fileName,
          img: reader.result,
          file: file
        })
      }
      reader.readAsDataURL(file);
    }
  }

  // Remove photos
  closeOnClick(file: any) {
    if (file.url !== '') this.toRemove.push(file);
    this.selectedPhotos = this.selectedPhotos.filter(photo => photo.name !== file.name);
  }
  
  getToAdd(): File[] {
    const toAdd: ProjectImage[] = this.selectedPhotos.filter(photo => photo.url === '');
    return toAdd.map(photo => photo.file);
  }
}
