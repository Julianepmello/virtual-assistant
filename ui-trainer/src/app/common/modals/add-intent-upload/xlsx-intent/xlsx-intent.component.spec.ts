import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XlsxIntentComponent } from './xlsx-intent.component';

describe('XlsxIntentComponent', () => {
  let component: XlsxIntentComponent;
  let fixture: ComponentFixture<XlsxIntentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XlsxIntentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XlsxIntentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
