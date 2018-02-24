import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideUploadComponent } from './slide-upload.component';

describe('SlideUploadComponent', () => {
  let component: SlideUploadComponent;
  let fixture: ComponentFixture<SlideUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
