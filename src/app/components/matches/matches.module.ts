import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesComponent } from './matches.component';
import { ConnectionModule } from '../connection/connection.module';

@NgModule({
  imports: [CommonModule, ConnectionModule],
  declarations: [MatchesComponent],
  exports: [MatchesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MatchesModule { }