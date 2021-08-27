import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent  implements OnDestroy{

  public title: string;
  public titleSubs$: Subscription;

  constructor(private router: Router) {
    
    this.titleSubs$ = this.getArgsRoute()
                      .subscribe( data => {
                          console.log(data);
                          this.title = data.title;
                          document.title = `AdminPro - ${this.title}`
                      });;
   }
  ngOnDestroy(): void {
    this.titleSubs$.unsubscribe();
  }

   getArgsRoute()
   {
      return this.router.events
      .pipe(
        filter( event => event instanceof ActivationEnd ),
        filter( (event: ActivationEnd ) => event.snapshot.firstChild === null ),
        map( (event: ActivationEnd ) => event.snapshot.data )
      )
   }

}
