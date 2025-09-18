import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-robot',
  imports: [CommonModule],
  templateUrl: './robot.html',
  styleUrl: './robot.scss'
})
export class RobotComponent {
  direction = input('NORTH');
  ngOnChanges() {
    console.log('Direction changed to', this.direction());
  }
}
