import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.page.html',
  styleUrls: ['./unsubscribe.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnsubscribePage implements OnInit {

  // Disabled for now. using sendgrid unsubsicbed link
  canShow = false;

  constructor(private navCtrl: NavController,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    const id = this.activeRoute.snapshot.paramMap.get('id');
  }

  goHome() {
    this.navCtrl.navigateRoot('/start')
    .catch((error) => {
      console.error(error);
    });
  }

}
