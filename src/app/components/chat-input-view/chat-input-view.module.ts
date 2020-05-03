import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatInputViewComponent } from '../chat-input-view/chat-input-view.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ChatInputViewComponent],
  exports: [ChatInputViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatInputViewModule { }