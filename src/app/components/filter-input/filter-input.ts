import { Component, computed, effect, input, output, signal, Signal } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { map, Observable, startWith, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, JsonPipe } from '@angular/common';

export function objTypeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    const isValid = value && typeof value === 'object' && ('id' in value || 'tech' in value || 'role' in value);
    return isValid ? null : { objTypeValidator: true };
  };
}

@Component({
  selector: 'app-filter-input',
  imports: [
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    AsyncPipe,
    JsonPipe,
  ],
  templateUrl: './filter-input.html',
  styleUrl: './filter-input.css',
})
export class FilterInput {
  bucket = environment.bucketUrl;
  control = new FormControl('', [Validators.required, objTypeValidator()]);
  options = input<any[]>([]);
  onSelected = output<any>();

  filteredOptions$: Observable<any[]>;

  isProject = false;
  isRole = false;
  isSkill = false;
  isOther = false;
  
  constructor() {
    this.filteredOptions$ = this.control.valueChanges.pipe(
      startWith(''),
      tap(value => {
        if (typeof value === 'string') {
          Promise.resolve().then(() => this.onSelected.emit(''));
        }
      }),
      map(value => this._filter(value || ''))
    );
    // reset
    effect(() => {
      if(this.options()) {
        this.control.setValue('');
      }
    });
    //  type
    effect(() => {
      if(this.options() && !this.isProject && !this.isRole && !this.isOther) {
        this._getInputType();
      }
    })
  }

  private _filter(value: string): any[] {
    if(typeof value === 'object') {
      return this.options().filter(() => value);
    }
    const filterValue = value.toLowerCase();
    if (Array.isArray(this.options()) && this.options().length > 0) {
      if (this.isRole) return this.options().filter(option => option.role.name.toLowerCase().includes(filterValue));
      if (this.isProject) return this.options().filter(option => option.name.toLowerCase().includes(filterValue));
      if (this.isSkill) return this.options().filter(option => option.tech.name.toLowerCase().includes(filterValue));
      if (this.isOther) return this.options().filter(option => option.name.toLowerCase().includes(filterValue));
    }
    return this.options().filter(option => option);
  }
  displayFn(selected: any): string {
    if(selected?.role?.name) return selected.role.name; 
    if(selected?.tech?.name) return selected.tech.name;
    if(selected.name) return selected.name;

    return '';
  }
  handleSelection(event: MatAutocompleteSelectedEvent) {
    this.onSelected.emit(event.option.value);
  }

  private _getInputType() {
    const list: any[] = this.options();

    if(list.length > 0 ){
      const item = list[0];

      this.isProject = this._isProject(item);
      this.isRole = this._isRole(item);
      this.isSkill = this._isSkill(item);
      this.isOther = this._isOther(item);
    }
  }
  private _isProject(item: any) {
    return item.configJson ? true : false;
  }
  private _isRole(item: any) {
    return item.role ? true : false;
  }
  private _isSkill(item: any) {
    return item.tech ? true : false;
  }
  private _isOther(item: any) {
    const isValid = !this.isProject && !this.isRole && !this.isSkill;
    return item.name && item.id && isValid ? true : false;
  }
}
