import { Component, OnInit, Input } from '@angular/core';
import { Connection } from 'src/app/interfaces/profile';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
})
export class ConnectionComponent implements OnInit {

  @Input() connection: Connection = null;

  constructor() { }

  ngOnInit() {}

}
