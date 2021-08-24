import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit{

  //@Input('valor') progreso: number = 50;
  @Input('valor') progreso: number = 50;
  @Input() btnClass: string = 'btn-primary';

  @Output() outputValue: EventEmitter<number> = new EventEmitter();

  get getPorcentaje(){
    return  `${this.progreso}%`
  }

  changeValue(value : number){
    if(this.progreso >= 100 && value >= 0){
      this.outputValue.emit(100);
      return this.progreso = 100;
    }
    
    if(this.progreso <= 0 && value < 0){
      this.outputValue.emit(0);
      return this.progreso = 0;
    }

    this.progreso = this.progreso + value;
    this.outputValue.emit(this.progreso);

  }

  onChange(newvalue: number)
  {
    if( newvalue >= 100)
    {
      this.progreso = 100;      
    }
    else if( newvalue <= 0)
    {
      this.progreso = 0;
    }
    else
    {
      this.progreso = newvalue;
    }

    this.outputValue.emit(this.progreso);
  }

  constructor() { }


  ngOnInit() {
    this.btnClass = `btn ${ this.btnClass }`
  }

}
