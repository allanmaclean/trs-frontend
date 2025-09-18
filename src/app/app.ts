import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './data.service';
import { RobotComponent } from './robot/robot';

const DIRECTIONS = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
export type Direction = typeof DIRECTIONS[number];

@Component({
  selector: 'app-root',
  imports: [CommonModule, RobotComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  readonly gridSize = 5;
  readonly rows: number[] = Array.from({ length: this.gridSize }, (_, y) => y).reverse();
  readonly cols: number[] = Array.from({ length: this.gridSize }, (_, x) => x);
  direction = signal<Direction>('NORTH');
  xPosition = 0;
  yPosition = 0;

  private dataService = inject(DataService);

  ngOnInit() {
    this.dataService.getHello().subscribe((data) => {
      console.log(data);
    });
  }

  placeRobot(x: number, y: number) {
    console.log(`PLACE ${x},${y},${this.direction}`);

    if (this.xPosition !== x || this.yPosition !== y) {
      this.xPosition = x;
      this.yPosition = y;
      this.dataService.updatePosition(x, y, this.direction());
    }
  }

  turnLeft() {
    console.log('LEFT');
    const idx = DIRECTIONS.indexOf(this.direction());
    this.direction.set(DIRECTIONS[(idx + DIRECTIONS.length - 1) % DIRECTIONS.length]);
    this.dataService.updatePosition(this.xPosition, this.yPosition, this.direction());
  }

  turnRight() {
    console.log('RIGHT');
    const idx = DIRECTIONS.indexOf(this.direction());
    this.direction.set(DIRECTIONS[(idx + 1) % DIRECTIONS.length]);
  }

  move() {
    console.log('MOVE');
    switch (this.direction()) {
      case 'NORTH':
        if (this.yPosition < this.gridSize - 1) {
          this.yPosition++;
        }
        break;
        case 'EAST':
        if (this.xPosition < this.gridSize - 1) {
          this.xPosition++;
        }
        break;
      case 'SOUTH':
        if (this.yPosition > 0) {
          this.yPosition--;
        }
        break;
      case 'WEST':
        if (this.xPosition > 0) {
          this.xPosition--;
        }
        break;
    }
    this.dataService.updatePosition(this.xPosition, this.yPosition, this.direction());
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: any) {
    console.log(event.key);
    switch (event.key) {
      case 'ArrowLeft':
        return this.turnLeft();
      case 'ArrowRight':
        return this.turnRight();
      case 'Enter':
        return this.move();
      default:
        return null
    }
  }
}
