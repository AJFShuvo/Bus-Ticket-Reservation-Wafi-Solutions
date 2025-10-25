import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBusForm } from './search-bus-form';

describe('SearchBusForm', () => {
  let component: SearchBusForm;
  let fixture: ComponentFixture<SearchBusForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBusForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBusForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
