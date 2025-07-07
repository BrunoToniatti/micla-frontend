import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagTeamComponent } from './tag-team.component';

describe('TagTeamComponent', () => {
  let component: TagTeamComponent;
  let fixture: ComponentFixture<TagTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagTeamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TagTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
