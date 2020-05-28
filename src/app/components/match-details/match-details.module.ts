import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchDetailsComponent } from './match-details.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MatchDetailsComponent],
  exports: [MatchDetailsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MatchDetailsModule { }