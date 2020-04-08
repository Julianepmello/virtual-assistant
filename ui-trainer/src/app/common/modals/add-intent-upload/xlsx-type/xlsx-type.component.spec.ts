import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XlsxTypeComponent } from './xlsx-type.component';

describe('XlsxTypeComponent', () => {
  let component: XlsxTypeComponent;
  let fixture: ComponentFixture<XlsxTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XlsxTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XlsxTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
