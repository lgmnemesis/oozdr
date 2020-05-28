import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { ConnectionsService } from 'src/app/services/connections.service';
import { Match } from 'src/app/interfaces/profile';

@Component({
  selector: 'app-chat-input-view',
  templateUrl: './chat-input-view.component.html',
  styleUrls: ['./chat-input-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatInputViewComponent implements OnInit {

  @ViewChild('inputbar') inputBar: ElementRef;

  @Input() 
  set match(m: Match) {
    this.activeMatch = m;
    this.setActiveInputWithRetries();
    this.markForCheck();
  }

  MAX_MESSAGE_LENGTH = 1500;
  emojiCssStyle = { position: 'fixed', bottom: '60px', right: '20px', 'z-index': '2' };

  activeMatch: Match;
  ctrlEnter = false;
  messageText = '';
  inputAutoGrow = true;
  isActiveInput = false;
  inputDisabled = true;
  showEmojiPicker = false;
  lastCursorPos = 0;
  isMobile = this.sharedService.isMobileApp();
  activeInputLock = false;
  activeInputCounter = 1;

  constructor(private cd: ChangeDetectorRef,
    public sharedService: SharedService,
    private connectionsService: ConnectionsService) { }

  ngOnInit() {}

  markForCheck() {
    this.cd.markForCheck();
  }

  onFocus() {
    this.isActiveInput = true;
    this.setActiveInput();
    this.markForCheck();
  }

  onBlur() {
    this.isActiveInput = false;
    this.markForCheck();
  }

  setActiveInputWithRetries() {
    if (this.isMobile || this.activeInputLock) {
      return ;
    }
    this.activeInputLock = true;
    this.retrySetActiveInput();
  }

  retrySetActiveInput() {
    setTimeout(() => {
      const st = this.setActiveInput();
      if (!st && this.activeInputCounter <= 3) {
        this.activeInputCounter++;
        this.retrySetActiveInput();
      } else {
        this.activeInputCounter = 1;
        this.activeInputLock = false; 
      }
    }, 100);
  }

  setActiveInput(): boolean {
    if (!this.inputBar || !this.inputBar.nativeElement) {
      return false;
    }
    const el = this.inputBar.nativeElement.querySelector('textarea');
    if (el) {
      el.focus();
      el.setAttribute('dir', 'auto');
      return true;
    }
    return false;
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
    if (message.length > 0 && this.activeMatch) {
      const msg = this.messageText;
      this.connectionsService.addMessage(this.activeMatch, msg);
      this.messageText = '';
      this.showEmojiPicker = false;
      this.inputDisabled = true;
      this.inputAutoGrow = true;
      try {
        const ta = <any>document.getElementById(this.activeMatch.id);
        const el = await ta.getInputElement();
        el.value = '';
        el.setSelectionRange(0, 0);
      } catch (error) {
        console.error(error);
      }
      this.markForCheck();
    }
  }

  async emojiSelected(event) {
    try {
      const emoji = event.emoji.native;
      const ta = <any>document.getElementById(this.activeMatch.id);
      const el = await ta.getInputElement();
      let textCursorPos = this.lastCursorPos;
      if (el.selectionStart) {
        textCursorPos = el.selectionStart;
      }
      const preffix = this.messageText.slice(0, textCursorPos);
      const suffix = this.messageText.slice(textCursorPos);
      this.messageText =  preffix + emoji + suffix;
      if (preffix && emoji) {
        this.lastCursorPos  = preffix.length + emoji.length;
      }
      this.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  toggleEmoji() {
    this.showEmojiPicker = !this.showEmojiPicker;
    this.markForCheck();
  }

}
