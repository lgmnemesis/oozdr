import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatInputViewComponent } from '../chat-input-view/chat-input-view.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@NgModule({
  imports: [CommonModule, PickerModule],
  declarations: [ChatInputViewComponent],
  exports: [ChatInputViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatInputViewModule { }