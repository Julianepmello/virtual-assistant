import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIntentUploadComponent } from './add-intent-upload.component';

describe('AddIntentUploadComponent', () => {
  let component: AddIntentUploadComponent;
  let fixture: ComponentFixture<AddIntentUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIntentUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIntentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
