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
    const isValid = value && typeof value === 'object' && ('id' in value || 'tech' in value);
    return isValid ? null : { objTypeValidator: true };
  };
}

@Component({
  selector: 'app-test',
  imports: [
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    AsyncPipe,
    JsonPipe,
  ],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test {
  bucket = environment.bucketUrl;
  control = new FormControl('', [Validators.required, objTypeValidator()]);

  options = input<any[]>([]);
  onSelected = output<any>();

  filteredOptions$: Observable<any[]>;
  
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

    effect(() => {
      if(this.options()) {
        this.reset();
      }
    });
  }

  // teste
  reset() {
    this.control.setValue('');
  }


  private _filter(value: string): any[] {
    if(typeof value === 'object') {
      return this.options().filter(() => value);
    }
    const filterValue = value.toLowerCase();
    if (Array.isArray(this.options()) && this.options().length > 0) {
      if ('name' in this.options()[0]) return this.options().filter(option => option.name.toLowerCase().includes(filterValue));
      if ('tech' in this.options()[0]) return this.options().filter(option => option.tech.name.toLowerCase().includes(filterValue));
    }
    return this.options().filter(option => option);
  }

  displayFn(selected: any): string {
    if(selected && selected.name) return selected.name;
    if(selected && selected.tech.name) return selected.tech.name;
    return '';
  }

  handleSelection(event: MatAutocompleteSelectedEvent) {
    this.onSelected.emit(event.option.value);
  }
}

// export class FilterInput {
//   bucket = environment.bucketUrl;
//   control = new FormControl('', [Validators.required, objTypeValidator()]);
//   options = input<any[]>([]);
//   onSelected = output<any>();

//   filteredOptions: Observable<any[]>;
  
//   constructor() {
//     this.filteredOptions = this.control.valueChanges.pipe(
//       startWith(''),
//       tap(value => {
//         if (typeof value === 'string') {
//           Promise.resolve().then(() => this.onSelected.emit(''));
//         }
//       }),
//       map(value => this._filter(value || ''))
//     );
//   }

//   private _filter(value: string): any[] {
//     if(typeof value === 'object') {
//       return this.options().filter(() => value);
//     }
//     const filterValue = value.toLowerCase();
//     if (Array.isArray(this.options()) && this.options().length > 0) {
//       if ('name' in this.options()[0]) return this.options().filter(option => option.name.toLowerCase().includes(filterValue));
//       if ('tech' in this.options()[0]) return this.options().filter(option => option.tech.name.toLowerCase().includes(filterValue));
//     }
//     return this.options().filter(option => option);
//   }

//   displayFn(selected: any): string {
//     if(selected && selected.name) return selected.name;
//     if(selected && selected.tech.name) return selected.tech.name;
//     return '';
//   }

//   handleSelection(event: MatAutocompleteSelectedEvent) {
//     this.onSelected.emit(event.option.value);
//   }
// }

// update enviroments secrets xD, with git actions...