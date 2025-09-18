import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { DataService } from './data.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';

describe('App', () => {
  let app: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [DataService, provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it("should call dataService.getLastPosition on init", () => {
    const dataService = fixture.debugElement.injector.get(DataService);
    const spy = spyOn(dataService, 'getLastPosition').and.callThrough();
    app.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should assign new values to xPosition, yPosition and direction on init if the db returns something other than the defaults', () => {
    const dataService = fixture.debugElement.injector.get(DataService);
    spyOn(dataService, 'getLastPosition').and.returnValue({
      subscribe: (fn: (value: any) => void) => fn({ move: '1,2,EAST' })
    } as any);
    app.ngOnInit();
    expect(app.xPosition).toBe(1);
    expect(app.yPosition).toBe(2);
    expect(app.direction()).toBe('EAST');
  });

  it("should not update the position if placeRobot is called with the same values", () => {
    const dataService = fixture.debugElement.injector.get(DataService);
    const spy = spyOn(dataService, 'updatePosition').and.callThrough();
    app.xPosition = 0;
    app.yPosition = 0;
    app.direction.set('NORTH');
    app.placeRobot(0, 0);
    expect(spy).not.toHaveBeenCalled();
  });

  it("should update the position if placeRobot is called with different values", () => {
    const dataService = fixture.debugElement.injector.get(DataService);
    const spy = spyOn(dataService, 'updatePosition').and.callThrough();
    app.xPosition = 0;
    app.yPosition = 0;
    app.direction.set('NORTH');
    app.placeRobot(1, 1);
    expect(spy).toHaveBeenCalled();
  });

  it("turnLeft should update the direction and call dataService.updatePosition", () => {
    const dataService = fixture.debugElement.injector.get(DataService);
    const spy = spyOn(dataService, 'updatePosition').and.callThrough();
    app.xPosition = 0;
    app.yPosition = 0;
    app.direction.set('NORTH');
    app.turnLeft();
    expect(app.direction()).toBe('WEST');
    expect(spy).toHaveBeenCalled();
  });

  it("turnRight should update the direction and call dataService.updatePosition", () => {
    const dataService = fixture.debugElement.injector.get(DataService);
    const spy = spyOn(dataService, 'updatePosition').and.callThrough();
    app.xPosition = 0;
    app.yPosition = 0;
    app.direction.set('WEST');
    app.turnRight();
    expect(app.direction()).toBe('NORTH');
    expect(spy).toHaveBeenCalled();
  });

  it("move should not allow movements off the grid", () => {
    const dataService = fixture.debugElement.injector.get(DataService);
    const spy = spyOn(dataService, 'updatePosition').and.callThrough();
    app.xPosition = 0;
    app.yPosition = 0;
    app.direction.set('SOUTH');
    app.move();
    expect(app.xPosition).toBe(0);
    expect(app.yPosition).toBe(0);
    expect(spy).not.toHaveBeenCalled();
    app.direction.set('WEST');
    app.move();
    expect(app.xPosition).toBe(0);
    expect(app.yPosition).toBe(0);
    expect(spy).not.toHaveBeenCalled();
    app.xPosition = app.gridSize - 1;
    app.yPosition = app.gridSize - 1;
    app.direction.set('NORTH');
    app.move();
    expect(app.xPosition).toBe(app.gridSize - 1);
    expect(app.yPosition).toBe(app.gridSize - 1);
    expect(spy).not.toHaveBeenCalled();
    app.direction.set('EAST');
    app.move();
    expect(app.xPosition).toBe(app.gridSize - 1);
    expect(app.yPosition).toBe(app.gridSize - 1);
    expect(spy).not.toHaveBeenCalled();
  });

  it("move should allow valid movements and call dataService.updatePosition", () => {
    const dataService = fixture.debugElement.injector.get(DataService);
    const spy = spyOn(dataService, 'updatePosition').and.callThrough();
    app.xPosition = 1;
    app.yPosition = 1;
    app.direction.set('NORTH');
    app.move();
    expect(app.xPosition).toBe(1);
    expect(app.yPosition).toBe(2);
    expect(spy).toHaveBeenCalled();
    app.direction.set('EAST');
    app.move();
    expect(app.xPosition).toBe(2);
    expect(app.yPosition).toBe(2);
    expect(spy).toHaveBeenCalledTimes(2);
    app.direction.set('SOUTH');
    app.move();
    expect(app.xPosition).toBe(2);
    expect(app.yPosition).toBe(1);
    expect(spy).toHaveBeenCalledTimes(3);
    app.direction.set('WEST');
    app.move();
    expect(app.xPosition).toBe(1);
    expect(app.yPosition).toBe(1);
    expect(spy).toHaveBeenCalledTimes(4);
  });

  it('should handle left arrow, right arrow and return key presses', () => {
    const dataService = fixture.debugElement.injector.get(DataService);
    const spy = spyOn(dataService, 'updatePosition').and.callThrough();
    app.xPosition = 1;
    app.yPosition = 1;
    app.direction.set('NORTH');
    const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    window.dispatchEvent(leftEvent);
    expect(app.direction()).toBe('WEST');
    expect(spy).toHaveBeenCalledTimes(1);
    const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    window.dispatchEvent(rightEvent);
    expect(app.direction()).toBe('NORTH');
    expect(spy).toHaveBeenCalledTimes(2);
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(enterEvent);
    expect(app.xPosition).toBe(1);
    expect(app.yPosition).toBe(2);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should ignore other key presses', () => {
    const dataService = fixture.debugElement.injector.get(DataService);
    const spy = spyOn(dataService, 'updatePosition').and.callThrough();
    app.xPosition = 1;
    app.yPosition = 1;
    app.direction.set('NORTH');
    const aEvent = new KeyboardEvent('keydown', { key: 'a' });
    window.dispatchEvent(aEvent);
    expect(app.direction()).toBe('NORTH');
    expect(app.xPosition).toBe(1);
    expect(app.yPosition).toBe(1);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should report the current position correctly', () => {
    spyOn(window, 'alert');
    app.xPosition = 2;
    app.yPosition = 3;
    app.direction.set('EAST');
    const clickEvent = new MouseEvent('click');
    const button = document.createElement('button');
    app.reportPosition(({ target: button } as any));
    expect(window.alert).toHaveBeenCalledWith('Output: 2,3,EAST');
  });
});
