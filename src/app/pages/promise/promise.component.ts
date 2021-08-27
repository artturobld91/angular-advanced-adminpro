import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promise',
  templateUrl: './promise.component.html',
  styles: [
  ]
})
export class PromiseComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    //this.getUsers();

    this.getUsers().then( usuarios => {
      console.log(usuarios);
    })

    // Convention parameter varibale is resolve
    // Convention parameter variable is reject
    //const promise = new Promise(( resolve, reject ) => {
    //    if(false)
    //      resolve('Hello World');
    //    else
    //      reject('Something went wrong');
    //})
    //.catch( error => console.log('Error in promise', error));

    // Successful scenario (then)
    // Error scenarion (catch)
    // Message variable recieved from resolve method
    //promise.then( (message) => {
    //    console.log('Hey I finished');
    //    console.log(message);
    //});

    //console.log('Init End')
  }

  getUsers()
  {
    const promise = new Promise( resolve => {
      fetch('https://reqres.in/api/users')
      .then( resp => resp.json())
      .then( body => resolve(body.data));
    });

    return promise;

  }

}
