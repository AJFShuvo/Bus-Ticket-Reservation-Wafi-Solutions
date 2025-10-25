import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusResultCard } from './bus-result-card';

describe('BusResultCard', () => {
  let component: BusResultCard;
  let fixture: ComponentFixture<BusResultCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusResultCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusResultCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
