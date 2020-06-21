import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProvSigninPage } from './prov-signin.page';

describe('ProvSigninPage', () => {
  let component: ProvSigninPage;
  let fixture: ComponentFixture<ProvSigninPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvSigninPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProvSigninPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
