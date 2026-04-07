import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityList } from './university-list';

describe('UniversityList', () => {
  let component: UniversityList;
  let fixture: ComponentFixture<UniversityList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversityList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversityList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
