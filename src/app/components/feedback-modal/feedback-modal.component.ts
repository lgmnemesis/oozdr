import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LocaleService } from 'src/app/services/locale.service';

@Component({
  selector: 'app-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackModalComponent implements OnInit {

  showFeedback = true;
  showThankYouMessage = false;

  constructor(private modalCtrl: ModalController,
    private cd: ChangeDetectorRef,
    public localeService: LocaleService) { }

  ngOnInit() {}

  markForCheck() {
    this.cd.markForCheck();
  }

  gotEvent(event) {
    if (event && event.showThankYouMessage) {
      this.showFeedback = false;
      this.showThankYouMessage = true;
      setTimeout(() => {
        this.close();
      }, 1400);
    } else if (event && event.close) {
      this.close();
    }
  }

  close(data?: any) {
    this.modalCtrl.dismiss(data).catch((error) => console.error(error));
  }

}
