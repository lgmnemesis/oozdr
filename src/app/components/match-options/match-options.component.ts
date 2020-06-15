import { Component, OnInit, Input } from '@angular/core';
import { Connection } from 'src/app/interfaces/profile';
import { PopoverController } from '@ionic/angular';
import { LocaleService } from 'src/app/services/locale.service';

@Component({
  selector: 'app-match-options',
  templateUrl: './match-options.component.html',
  styleUrls: ['./match-options.component.scss'],
})
export class MatchOptionsComponent implements OnInit {

  @Input() connection: Connection;

  dictionary = this.localeService.dictionary;
  dictMatch = this.dictionary.matchOptionsComponent;

  constructor(private popoverCtrl: PopoverController,
    private localeService: LocaleService) { }

  ngOnInit() {
  }

  blockButton() {
    this.close({block: true});
  }

  close(data?: any) {
    this.popoverCtrl.dismiss(data).catch(error => console.error(error));
  }

}
