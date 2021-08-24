import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component{
  @Output() labels: EventEmitter<string[]> = new EventEmitter();
  
  public labels1: string[] = ['Pan', 'Refresco', 'Tacos'];

  @Output() data: EventEmitter<number[]> = new EventEmitter();
  
  public data1 = [
    [10, 15, 40]
  ];

}
