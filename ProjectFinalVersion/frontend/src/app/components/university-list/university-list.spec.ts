import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityListComponent } from './university-list';

describe('UniversityList', () => {
  let component: UniversityListComponent;
  let fixture: ComponentFixture<UniversityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversityListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversityListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
