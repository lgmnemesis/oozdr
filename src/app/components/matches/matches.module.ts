import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesComponent } from './matches.component';
import { MatchPreviewModule } from '../match-preview/match-preview.module';
import { GetLastMessagesPipe } from 'src/app/pipes/get-last-messages.pipe';

@NgModule({
  imports: [CommonModule, MatchPreviewModule],
  declarations: [MatchesComponent, GetLastMessagesPipe],
  exports: [MatchesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MatchesModule { }