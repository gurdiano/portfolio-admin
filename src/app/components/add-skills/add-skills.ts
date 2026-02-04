import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TechnologiesService } from '../../services/technologies/technologies-service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BaseCard } from '../base-card/base-card';
import { MatButton } from '@angular/material/button';
import { FilterInput } from '../filter-input/filter-input';
import { SkillService } from '../../services/skills/skill-service';
import { ErrorResponseBody, ResponseMsg, SuccessResponseBody } from '../response-msg/response-msg';
import { map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-add-skills',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButton,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    JsonPipe,
    AsyncPipe,
    BaseCard,
    FilterInput,
    ResponseMsg,
  ],
  templateUrl: './add-skills.html',
  styleUrl: './add-skills.css',
})
export class AddSkills {
  private formBuilder = inject(FormBuilder);
  private techService = inject(TechnologiesService);
  private skillService = inject(SkillService);

  success: null | SuccessResponseBody = null;
  error: null | ErrorResponseBody  = null;
  bucket = environment.bucketUrl;
  techProgress = this.skillService.techProgress;

  skillForm = this.formBuilder.group({
    technology: ['', Validators.required],
    level: [0, [Validators.required, Validators.min(1)]],
    update: [false]
  });

  // technology input 
  technologyOptions = this.techService.allTechnologies;

  handleSelection(itemSelected: any) {
    const isValid = itemSelected! && typeof itemSelected === 'object' && 'id' in itemSelected && 'name';

    if (isValid) {
      this.skillForm.patchValue({ technology : itemSelected });
      this.selectedValidation(itemSelected);
    }
    else{
      this.skillForm.patchValue({ technology : '' });
    } 
  }

  private selectedValidation(itemSelected: any) {
    const techId = itemSelected.id

    this.skillService.getUserTechProgress().subscribe(() => {
      const obj = this.skillService.getSkill(techId);
        if (obj) {
          this.skillForm.patchValue({ level : obj.progress, update : true });
          this.item_progress.set(obj.progress);
        }else {
          this.skillForm.patchValue({ level : 0, update : false });
          this.item_progress.set(0);
        }
    });
  }

  // submit
  onSubmit() {
    const formValue = this.skillForm.value;
    const level = formValue.level as number;
    const techId = (formValue.technology as any).id;

    if (formValue.update) {
      const skill: SkillPutResponse = {
        techId: techId,
        progress: level,
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
    }else {
      const skill: SkillPostResponse = {
        techId: techId,
        progress: level,
      } 

      this.skillService.postUserTechnologyProgress(skill).pipe(
        switchMap(postResponse => 
          this.skillService.getUserTechProgress().pipe(
            map(() => postResponse)
          )
        )
      ).subscribe({
        next: (response) => {
          this.success = { mesage: `The Skill has been created, TechProgress{ techId: ${response.techId}, progress: ${response.progress} }`, response: response };
        },
        error: (response) => {
          this.error = { mesage: 'Failed to', error: response };
        }
      });
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

    this.skillForm.patchValue({
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

  // new technology
  scrollToElement(): void {    
    const element = document.getElementById('destino-scroll');
    if(element) { 
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
