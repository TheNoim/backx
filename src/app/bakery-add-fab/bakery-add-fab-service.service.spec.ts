import { TestBed } from '@angular/core/testing';

import { BakeryAddFabServiceService } from './bakery-add-fab-service.service';

describe('BakeryAddFabServiceService', () => {
  let service: BakeryAddFabServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BakeryAddFabServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
