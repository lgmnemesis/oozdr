import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchOptionsComponent } from './match-options.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MatchOptionsComponent],
  exports: [MatchOptionsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MatchOptionsModule { }