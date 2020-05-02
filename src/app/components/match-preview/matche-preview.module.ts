import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchPreviewComponent } from './match-preview.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MatchPreviewComponent],
  exports: [MatchPreviewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MatchPreviewModule { }