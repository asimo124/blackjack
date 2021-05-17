import { TestBed } from '@angular/core/testing';

import { BlackJackService } from './black-jack.service';

describe('BlackJackService', () => {
  let service: BlackJackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlackJackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
