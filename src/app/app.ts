import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly gridSize = 5;
  readonly rows: number[] = Array.from({ length: this.gridSize }, (_, y) => y).reverse();
  readonly cols: number[] = Array.from({ length: this.gridSize }, (_, x) => x);
  direction: 'NORTH' | 'EAST' | 'SOUTH' | 'WEST' = 'NORTH'; // This should probably be an array if we need to jump from west to north etc
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
      this.dataService.updatePosition(x, y);
    }
  }
}
