import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { TransfersService } from './transfers.service';

describe('TransfersService', () => {
  let service: TransfersService;

  let httpClientStub: Partial<HttpClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[{provide: HttpClient, useValue: httpClientStub}]
    });
    service = TestBed.inject(TransfersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
