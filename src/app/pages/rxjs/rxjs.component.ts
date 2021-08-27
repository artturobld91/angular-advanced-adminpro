import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnInit, OnDestroy {

  // retry -> To retry observable operations
  // take -> How many emitions need from observable to then complete
  // filter -> Allows to filter information received by observable, it contains a condition normaly ternary operator
  // map -> To transform information received by observable
  // interval -> To return observable with interval functionality

  //Best Practices:
  // Unsuscribe from used observables

  public intervalSubs: Subscription;

  constructor() { 

    // this.returnObservable().pipe(
    //   retry(2)
    // ).subscribe(
    //   valor => console.log('Subs:', valor),
    //   error => console.warn('Error:', error),
    //   () => console.info('Obs terminado')
    // );

    this.intervalSubs = this.returnInterval().subscribe(
      (valor) => console.log(valor)
    );

  }

  ngOnDestroy(): void {
    
    this.intervalSubs.unsubscribe();

  }

  ngOnInit(): void {
  }


  returnInterval(): Observable<number> {

    const interval$ = interval(100)
                      .pipe(
                        //take(10),
                        map( valor =>  { return valor + 1;}),
                        filter( valor => ( valor % 2 === 0 ) ? true : false ),
                      );

    return interval$;
  }

  returnObservable(): Observable<number>{
    //Convention for naming observables use $
    const obs$ = new Observable<number>( observer => {
      let i  = -1;
      const intervalo = setInterval( () => {
        i++;
        //Necessary step to notify (observer.next)
        observer.next(i);

        if(i == 4){
          clearInterval(intervalo)
          observer.complete();
        }

        if ( i ==2)
        {
          observer.error('i llego al valor de 2')
        }
      }, 1000)

    });

    return obs$;

  }

}
