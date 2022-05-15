import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BakeryAdminUserAddFabComponent } from './bakery-admin-user-add-fab.component';

describe('BakeryAdminUserAddFabComponent', () => {
  let component: BakeryAdminUserAddFabComponent;
  let fixture: ComponentFixture<BakeryAdminUserAddFabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BakeryAdminUserAddFabComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BakeryAdminUserAddFabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
