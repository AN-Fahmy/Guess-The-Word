import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessgameComponent } from './guessgame.component';

describe('GuessgameComponent', () => {
  let component: GuessgameComponent;
  let fixture: ComponentFixture<GuessgameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessgameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuessgameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
