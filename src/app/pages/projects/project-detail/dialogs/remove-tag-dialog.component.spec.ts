import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveTagDialogComponent } from './remove-tag-dialog.component';

describe('RemoveTagDialogComponent', () => {
  let component: RemoveTagDialogComponent;
  let fixture: ComponentFixture<RemoveTagDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveTagDialogComponent]
    });
    fixture = TestBed.createComponent(RemoveTagDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
