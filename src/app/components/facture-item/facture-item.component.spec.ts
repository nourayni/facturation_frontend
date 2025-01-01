import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureItemComponent } from './facture-item.component';

describe('FactureItemComponent', () => {
  let component: FactureItemComponent;
  let fixture: ComponentFixture<FactureItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactureItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
