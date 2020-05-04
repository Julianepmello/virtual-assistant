import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XlsxResponseComponent } from './xlsx-response.component';

describe('XlsxResponseComponent', () => {
  let component: XlsxResponseComponent;
  let fixture: ComponentFixture<XlsxResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XlsxResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XlsxResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
