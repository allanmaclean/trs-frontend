import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('Data', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have getLastPosition and updatePosition methods', () => {
    expect(service.getLastPosition).toBeDefined();
    expect(service.updatePosition).toBeDefined();
  });

  it('should call getLastPosition and return expected data', (done: DoneFn) => {
    const mockResponse = { id: 1, move: '0,0,NORTH' };
    spyOn(service['http'], 'get').and.returnValue({
      subscribe: (fn: (value: any) => void) => fn(mockResponse)
    } as any);

    service.getLastPosition().subscribe((data) => {
      expect(data).toEqual(mockResponse);
      done();
    });
  });

  it('should call updatePosition and handle success response', () => {
    spyOn(service['http'], 'post').and.returnValue({
      subscribe: (callbacks: { next: (value: any) => void; error: (err: any) => void }) => {
        callbacks.next('Success');
      }
    } as any);
    const consoleSpy = spyOn(console, 'log');
    service.updatePosition(0, 0, 'NORTH');
    expect(consoleSpy).toHaveBeenCalledWith('Position updated successfully');
  });

  it('should call updatePosition and handle error response', () => {
    spyOn(service['http'], 'post').and.returnValue({
      subscribe: (callbacks: { next: (value: any) => void; error: (err: any) => void }) => {
        callbacks.error('Error');
      }
    } as any);
    const consoleSpy = spyOn(console, 'error');
    service.updatePosition(0, 0, 'NORTH');
    expect(consoleSpy).toHaveBeenCalledWith('Error updating position', 'Error');
  });
});
