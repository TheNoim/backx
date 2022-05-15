import { TestBed } from '@angular/core/testing';

import { SubscribableTitleServiceService } from './subscribable-title-service.service';

describe('SubscribableTitleServiceService', () => {
  let service: SubscribableTitleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscribableTitleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
