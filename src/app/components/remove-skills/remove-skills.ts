import { Component, inject } from '@angular/core';
import { BaseCard } from '../base-card/base-card';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TechnologiesService } from '../../services/technologies/technologies-service';
import { environment } from '../../../environments/environment';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { FilterInput } from '../filter-input/filter-input';
import { SkillService } from '../../services/skills/skill-service';
import { ErrorResponseBody, ResponseMsg, SuccessResponseBody } from '../response-msg/response-msg';
import { Test } from '../test/test';

@Component({
  selector: 'app-remove-skills',
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
    ResponseMsg,
  ],
  templateUrl: './remove-skills.html',
  styleUrl: './remove-skills.css',
})
export class RemoveSkills {
  private skillService = inject(SkillService);
  private formBuilder = inject(FormBuilder);
  
  bucket = environment.bucketUrl;
  skillsOptions = this.skillService.techProgress;
  success: null | SuccessResponseBody = null;
  error: null | ErrorResponseBody  = null;

  skillForm = this.formBuilder.group({
    skill: ['', Validators.required],
  });
  
  // submit
  onSubmit() {
    const techId = (this.skillForm.value.skill as any).tech.id;
    this.skillService.deleteUserTechnologyProgress(techId).pipe(
      switchMap(deleteResponse => this.skillService.getUserTechProgress().pipe(
        map(() => deleteResponse)
      ))
    ).subscribe({
      next: (response) => {
        this.success = { mesage: `Skill deleted!`, response: response };
      },
      error: (response) => {
        this.error = { mesage: `Failed to delete`, error: response };
      }
    });
  }

  // skill input
  handleSelection(itemSelected: any) {
    const isValid = itemSelected && typeof itemSelected === 'object' && 'tech' in itemSelected;
    if(isValid) this.skillForm.patchValue({ skill: itemSelected });
    else this.skillForm.patchValue({ skill: '' });
  }
}