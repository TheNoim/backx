import { TestBed } from '@angular/core/testing';

import { RecipeEditFabService } from './recipe-edit-fab.service';

describe('RecipeEditFabService', () => {
  let service: RecipeEditFabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeEditFabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
