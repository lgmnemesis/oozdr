import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatContentViewComponent } from './chat-content-view.component';
import { ChatTimeUniquePipe } from '../../pipes/chat-time-unique.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [ChatContentViewComponent, ChatTimeUniquePipe],
  exports: [ChatContentViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatContentViewModule { }