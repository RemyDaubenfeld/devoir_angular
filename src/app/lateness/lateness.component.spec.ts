import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatenessComponent } from './lateness.component';

describe('LatenessComponent', () => {
  let component: LatenessComponent;
  let fixture: ComponentFixture<LatenessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatenessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LatenessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
