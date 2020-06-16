import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UnsubscribePage } from './unsubscribe.page';

describe('UnsubscribePage', () => {
  let component: UnsubscribePage;
  let fixture: ComponentFixture<UnsubscribePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsubscribePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UnsubscribePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
