import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotteryFieldComponent } from './lottery-field.component';

describe('LotteryFieldComponent', () => {
  let component: LotteryFieldComponent;
  let fixture: ComponentFixture<LotteryFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LotteryFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LotteryFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
