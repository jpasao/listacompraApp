import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SaveProductPage } from './save-product.page';

describe('SaveProductPage', () => {
  let component: SaveProductPage;
  let fixture: ComponentFixture<SaveProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveProductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SaveProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
