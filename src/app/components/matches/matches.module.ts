import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesComponent } from './matches.component';
import { MatchPreviewModule } from '../match-preview/match-preview.module';

@NgModule({
  imports: [CommonModule, MatchPreviewModule],
  declarations: [MatchesComponent],
  exports: [MatchesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MatchesModule { }