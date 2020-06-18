import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProvStartPage } from './prov-start.page';

describe('ProvStartPage', () => {
  let component: ProvStartPage;
  let fixture: ComponentFixture<ProvStartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvStartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProvStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
