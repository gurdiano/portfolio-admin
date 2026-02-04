import { Component, computed, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BaseCard } from '../base-card/base-card';
import { MatButton } from '@angular/material/button';
import { forkJoin, map, startWith, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { toSignal } from '@angular/core/rxjs-interop';
import { IconService } from '../../services/icon/icon-service';
import { TechnologiesService } from '../../services/technologies/technologies-service';
import { ErrorResponseBody, ResponseMsg, SuccessResponseBody } from '../response-msg/response-msg';
import { FilterInput } from '../filter-input/filter-input';

export const atLeastOneRequired: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const icon = control.get('icon')?.value;
  const image = control.get('image')?.value;
  const toggle = control.get('toggle')?.value;
  return (!icon && toggle === 'gallery') || (!image && toggle === 'upload')? { selectionRequired: true } : null;
};

@Component({
  selector: 'app-create-technologies',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatButton,
    AsyncPipe,
    ReactiveFormsModule,
    BaseCard,
    ResponseMsg,
    FilterInput
  ],
  templateUrl: './create-technologies.html',
  styleUrl: './create-technologies.css',
})
export class CreateTechnologies {
  private formBuilder = inject(FormBuilder);
  private iconService = inject(IconService);
  private techService = inject(TechnologiesService);
  
  bucket = environment.bucketUrl;
  success: null | SuccessResponseBody = null;
  error: null | ErrorResponseBody = null;
  options = this.iconService.allIcons;
  
  techForm = this.formBuilder.group({
    name: ['', Validators.required],
    sourceForm: this.formBuilder.group({
      toggle: ['gallery'],
      icon: ['asaassa'],
      image: [null as File | null]
    },{ validators: [atLeastOneRequired] }),
  });

  // select icon
  handleSelection (itemSelected: any) { 
    const isValid = itemSelected! && typeof itemSelected === 'object' && 'id' in itemSelected && 'name';
    if (isValid) this.techForm.controls.sourceForm.patchValue({ icon : itemSelected });
    else this.techForm.controls.sourceForm.patchValue({ icon : '' });  
  }
  
  // submit
  onSubmit() {
    const name = this.techForm.value.name!;
    const techFormControl = this.techForm.controls;
    
    const toggle = techFormControl.sourceForm.value.toggle;
    const icon = techFormControl.sourceForm.value.icon;
    const image = techFormControl.sourceForm.value.image!;

    if(toggle === 'gallery') {
      this.techService.postTechnology(name, icon, null).pipe(switchMap(
        postResponse => this.techService.getAllTechnlogies().pipe(
          map(() => postResponse)
        )
      )).subscribe({
        next: (res) => {
          this.success = {mesage:`The technology has been created, Technology{id: ${res}, name: ${name}}`, response: res};
          this.techService.getAllTechnlogies();
        },
        error: (res) => {
          this.error = {mesage: 'Failed to', error: res};
        }
      });
    };
    if(toggle === 'upload') {
      this.iconService.postIcon(name, image).pipe(
        switchMap( iconResponse => 
          this.techService.postTechnology(name, null, iconResponse).pipe(
            map(techResponse => ({ techResponse, iconResponse }))
          )
        ),
        switchMap( response => forkJoin([
          this.techService.getAllTechnlogies(),
          this.iconService.getAllIcons()
        ]).pipe(map(() => response)))
      ).subscribe({
        next: (response) => {
          this.success = {
            mesage:`Tecnologies created. Technology{id: ${response.techResponse}, name: ${name}} Icon{id: ${response.iconResponse}, name: ${name}}`, 
            response: `${response.techResponse} ${response.iconResponse}`
          };
        },
        error: (response) => {
          this.error = {mesage: 'Failed to', error: response};
        }
      }); 
    }
  } 
  // drag and drop
  isDragging = false;
  selectedFileName = '';
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
          this.handleFile(files[0]);
      }
  }
  onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) this.handleFile(file);
  }
  private handleFile(file: File) {
      this.selectedFileName = file.name;
      this.techForm.controls.sourceForm.patchValue({ image: file });
  }  
}