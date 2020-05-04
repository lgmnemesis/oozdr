import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-match-options',
  templateUrl: './match-options.component.html',
  styleUrls: ['./match-options.component.scss'],
})
export class MatchOptionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  clicked() {
    console.log('clicked');
  }

}
