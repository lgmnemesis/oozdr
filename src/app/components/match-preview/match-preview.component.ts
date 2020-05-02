import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Connection } from 'src/app/interfaces/profile';

@Component({
  selector: 'app-match-preview',
  templateUrl: './match-preview.component.html',
  styleUrls: ['./match-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchPreviewComponent implements OnInit {

  @Input() connection: Connection;
  @Input() inViewMode = false;

  defaultProfileImg =  '../../../assets/images/profile-def.png';

  constructor() {}

  ngOnInit() {
  }

}
