import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhyOozdrComponent } from './why-oozdr.component';

@NgModule({
  imports: [CommonModule],
  declarations: [WhyOozdrComponent],
  exports: [WhyOozdrComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WhyOozdrModule { }