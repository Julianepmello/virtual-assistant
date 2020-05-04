import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResponseUploadComponent } from './add-response-upload.component';

describe('AddResponseUploadComponent', () => {
  let component: AddResponseUploadComponent;
  let fixture: ComponentFixture<AddResponseUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddResponseUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddResponseUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
