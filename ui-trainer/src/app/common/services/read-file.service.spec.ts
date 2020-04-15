import { TestBed } from '@angular/core/testing';

import { ReadFileService } from './read-file.service';

describe('ReadFileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReadFileService = TestBed.get(ReadFileService);
    expect(service).toBeTruthy();
  });
});
