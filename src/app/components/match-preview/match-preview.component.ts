import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Connection } from 'src/app/interfaces/profile';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-match-preview',
  templateUrl: './match-preview.component.html',
  styleUrls: ['./match-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchPreviewComponent implements OnInit {

  @Input() connection: Connection;
  @Input() inViewMode = false;

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.connection.user_profle_img_url = 'https://pd2eu.bumbcdn.com/p74/159/4/9/7/783693202/d5086/t1587845924/c_2TNgucQ9YMidQZ0mlK-c8cOzSVaQFXOiPZh5rdB.gHFX.bYb6rZUjQ/5086654/dfs_920/osz_48x48.jpg?jpegq=80&nope=1&h=ugh';
  }

}
