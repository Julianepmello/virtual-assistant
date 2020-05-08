import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XlsxStoryComponent } from './xlsx-story.component';

describe('XlsxStoryComponent', () => {
  let component: XlsxStoryComponent;
  let fixture: ComponentFixture<XlsxStoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XlsxStoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XlsxStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
