import {Component, OnInit, ViewChild} from '@angular/core';
import {CognitoService} from "./aws/cognito.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  loginUrl = CognitoService._LOGIN_URL;

  constructor(private route: ActivatedRoute,
              private cognitoService: CognitoService) {}

  ngOnInit() {
    this.route.fragment.subscribe(params => {
      if(params) {
        const parameter = params.split('&');
        const idToken = parameter[0].split('=')[1];
        const accessToken = parameter[1].split('=')[1];
        this.cognitoService.buildCognitoCreds(idToken, accessToken);
      }
    });
  };

  public logout() {
    console.log('logout');
    this.cognitoService.logout();
  }

  public isLoggedIn() {
    return this.cognitoService.isLoggedIn();
  }
}
