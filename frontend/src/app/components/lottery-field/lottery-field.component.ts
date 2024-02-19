import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lottery-field',
  templateUrl: './lottery-field.component.html',
  styleUrl: './lottery-field.component.scss'
})
export class LotteryFieldComponent {

  @Input() field: number[] | undefined;

  constructor() {

  }

  ngOnInit(): void {

  }

  getNumbers(): number[] {
    return Array.from({ length: 49 }, (_, i) => i + 1);
  }

}
