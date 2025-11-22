import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllRoom } from './listAllRoom';

describe('ListAllRoom', () => {
  let component: ListAllRoom;
  let fixture: ComponentFixture<ListAllRoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllRoom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllRoom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});