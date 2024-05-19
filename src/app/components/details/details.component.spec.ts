import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDetailComponent } from './details.component';

describe('MovieDetailComponent', () => {
  let component: MovieDetailComponent;
  let fixture: ComponentFixture<MovieDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovieDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovieDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
