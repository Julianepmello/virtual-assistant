import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoryUploadComponent } from './add-story-upload.component';

describe('AddStoryUploadComponent', () => {
  let component: AddStoryUploadComponent;
  let fixture: ComponentFixture<AddStoryUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStoryUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStoryUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
