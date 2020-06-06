import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WhyOozdrComponent } from './why-oozdr.component';

describe('WhyOozdrComponent', () => {
  let component: WhyOozdrComponent;
  let fixture: ComponentFixture<WhyOozdrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhyOozdrComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WhyOozdrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
