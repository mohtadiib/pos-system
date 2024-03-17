import { TestBed } from '@angular/core/testing';

import { ImagesGridService } from './images-grid.service';

describe('ImagesGridService', () => {
  let service: ImagesGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagesGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
