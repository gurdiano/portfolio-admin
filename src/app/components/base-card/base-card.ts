import { UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-base-card',
  imports: [
    UpperCasePipe,
  ],
  templateUrl: './base-card.html',
  styleUrl: './base-card.css',
})
export class BaseCard {
  @Input() name?: string;
  @Input() icon?: string;

}
