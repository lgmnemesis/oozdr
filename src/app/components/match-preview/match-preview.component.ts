import { Component, OnInit, Input } from '@angular/core';
import { Connection } from 'src/app/interfaces/profile';

@Component({
  selector: 'app-match-preview',
  templateUrl: './match-preview.component.html',
  styleUrls: ['./match-preview.component.scss'],
})
export class MatchPreviewComponent implements OnInit {

  @Input() connection: Connection;
  @Input() inViewMode = false;

  constructor() { }

  ngOnInit() {}

}
