import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'facebook';


  testfunction(){
    debugger;
    var i =10;
    var j =20;
    var c= i+j;
    alert(c);
  }

}
