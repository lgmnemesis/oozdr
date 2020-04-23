import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { WelcomeService } from 'src/app/services/welcome.service';

@Component({
  selector: 'app-welcome-container',
  templateUrl: './welcome-container.component.html',
  styleUrls: ['./welcome-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeContainerComponent implements OnInit {

  constructor(private welcomeService: WelcomeService) { }

  ngOnInit() {
  }

}
