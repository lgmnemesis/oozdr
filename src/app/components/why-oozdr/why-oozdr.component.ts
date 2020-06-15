import { Component, OnInit } from '@angular/core';
import { LocaleService } from 'src/app/services/locale.service';

@Component({
  selector: 'app-why-oozdr',
  templateUrl: './why-oozdr.component.html',
  styleUrls: ['./why-oozdr.component.scss'],
})
export class WhyOozdrComponent implements OnInit {

  dictionary = this.localeService.dictionary;
  dictWhy = this.dictionary.whyOozdrComponent;
  
  constructor(private localeService: LocaleService) { }

  ngOnInit() {}

}
