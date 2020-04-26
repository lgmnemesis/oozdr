import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesComponent } from './matches.component';
import { Ng2TelInputModule } from 'ng2-tel-input';

@NgModule({
  imports: [CommonModule, Ng2TelInputModule],
  declarations: [MatchesComponent],
  exports: [MatchesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MatchesModule { }