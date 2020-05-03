import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-chat-input-view',
  templateUrl: './chat-input-view.component.html',
  styleUrls: ['./chat-input-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatInputViewComponent implements OnInit {

  MAX_MESSAGE_LENGTH = 1500;

  @ViewChild('textarea', {static: false}) private textarea: any;

  ctrlEnter = false;
  messageText = '';
  inputAutoGrow = true;
  isActiveInput = false;
  inputDisabled = true;
  showEmojiPicker = false;

  constructor(private cd: ChangeDetectorRef,
    public sharedService: SharedService) { }

  ngOnInit() {}

  markForCheck() {
    this.cd.markForCheck();
  }

  ctrlEnterPressed() {
    this.ctrlEnter = true;
    this.messageText += '\n';
  }

  inputChange(event) {
    const msg = event.detail.value;
    if (!this.ctrlEnter && msg.match('\n$') && msg.trim().length > 0 && !this.sharedService.isMobileApp()) {
      this.sendMessage();
      return;
    }
    this.ctrlEnter = false;
    this.messageText = event.detail.value;
    const numOfLines = this.messageText.split(/\r?\n/).length;
    if (numOfLines > 4 || this.messageText.length > 300) {
      this.inputAutoGrow = false;
    } else {
      this.inputAutoGrow = true;
    }
    const t = event.detail.value.trim();
    if (t.length > 0) {
      this.inputDisabled = false;
    }
    if (t.length > this.MAX_MESSAGE_LENGTH) {
      this.inputDisabled = true;
    }
  }

  async sendMessage() {
    const message = this.messageText.trim();
    if (message.length > this.MAX_MESSAGE_LENGTH) {
      return;
    }
    if (message.length > 0) {
      // this.chatAction = {
      //   action: 'add',
      //   message: this.messageText
      // };
      this.messageText = '';
      this.showEmojiPicker = false;
      this.inputDisabled = true;
      this.inputAutoGrow = true;
      try {
        const el = await this.textarea.getInputElement();
        el.value = '';
        el.setSelectionRange(0, 0);
      } catch (error) {
        console.error(error);
      }
      this.markForCheck();
    }
  }

  toggleEmoji() {
    this.showEmojiPicker = !this.showEmojiPicker;
    this.markForCheck();
  }

}
