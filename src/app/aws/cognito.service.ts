import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import {
  CognitoUserPool, CognitoUser, CognitoUserSession, CognitoIdToken,
  CognitoAccessToken, CognitoRefreshToken
} from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import * as awsservice from "aws-sdk/lib/service";
import * as CognitoIdentity from "aws-sdk/clients/cognitoidentity";
import * as jwt from "jsonwebtoken";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";

@Injectable()
export class CognitoService {

  public static _REGION = environment.region;

  public static _IDENTITY_POOL_ID = environment.identityPoolId;
  public static _USER_POOL_ID = environment.userPoolId;
  public static _CLIENT_ID = environment.clientId;
  public static _IDP_ENDPOINT = `cognito-idp.${environment.region}.amazonaws.com`;
  public static _IDENTITY_ENDPOINT = `cognito-identity.${environment.region}.amazonaws.com`;

  public static _IDP_DOMAIN = `https://${environment.cognitoDomain}.auth.${environment.region}.amazoncognito.com`;
  public static _LOGOUT_URL = `${CognitoService._IDP_DOMAIN}/logout?logout_uri=${environment.baseUrl}&client_id=${environment.clientId}`;
  public static _LOGIN_URL = `${CognitoService._IDP_DOMAIN}/login?redirect_uri=${environment.baseUrl}&response_type=token&client_id=${environment.clientId}`;

  public static _POOL_DATA: any = {
    UserPoolId: CognitoService._USER_POOL_ID,
    ClientId: CognitoService._CLIENT_ID
  };

  public cognitoCreds: AWS.CognitoIdentityCredentials;

  constructor(private router: Router) {}

  getUserPool() {
    CognitoService._POOL_DATA.endpoint = CognitoService._IDP_ENDPOINT;
    return new CognitoUserPool(CognitoService._POOL_DATA);
  }

  getCurrentUser() {
    return this.getUserPool().getCurrentUser();
  }

  // AWS Stores Credentials in many ways, and with TypeScript this means that
  // getting the base credentials we authenticated with from the AWS globals gets really murky,
  // having to get around both class extension and unions. Therefore, we're going to give
  // developers direct access to the raw, unadulterated CognitoIdentityCredentials
  // object at all times.
  setCognitoCreds(creds: AWS.CognitoIdentityCredentials) {
    this.cognitoCreds = creds;
  }

  getCognitoCreds() {
    return this.cognitoCreds;
  }

  /*
    This method creates all objects that will be created during an authenticateUser
    request with the amazon-cognito-identity-js library. So it is the equivalent for the hosted UI.
   */
  buildCognitoCreds(idTokenJwt: string, accessTokenJwt: string) {
    const decoded = jwt.decode(idTokenJwt, {complete: true});

    this.createCognitoIdentityCredentials(idTokenJwt);
    this.createCognitoUser(decoded['payload']['cognito:username'], this.createUserSession(idTokenJwt, accessTokenJwt));
  }

  private createCognitoUser(userName: string, userSession: CognitoUserSession) {
    const userData = {
      Username : userName,
      Pool : this.getUserPool()
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.setSignInUserSession(userSession);
  }

  private createCognitoIdentityCredentials(idTokenJwt: string) {
    const url = CognitoService._IDP_ENDPOINT + '/' + CognitoService._USER_POOL_ID;
    const serviceConfigs = <awsservice.ServiceConfigurationOptions>{};
    const logins: CognitoIdentity.LoginsMap = {};

    logins[url] = idTokenJwt;
    serviceConfigs.endpoint = CognitoService._IDENTITY_ENDPOINT;

    const params = {
      IdentityPoolId: CognitoService._IDENTITY_POOL_ID, /* required */
      Logins: logins
    };

    const creds = new AWS.CognitoIdentityCredentials(params, serviceConfigs);

    AWS.config.region = CognitoService._REGION;
    AWS.config.credentials = creds;

    this.setCognitoCreds(creds);

    this.cognitoCreds.refresh((err => {
      if(err) {
        console.log("Login failed");
      } else {
        console.log("Login success: ");
      }
    }));
  }

  private createUserSession(idTokenJwt: string, accessToken: string): CognitoUserSession {
    let sessionData = {
      IdToken: new CognitoIdToken({IdToken: idTokenJwt}),
      AccessToken: new CognitoAccessToken({AccessToken: accessToken}),
      RefreshToken: new CognitoRefreshToken({RefreshToken: ''})
    };

    return new CognitoUserSession(sessionData);
  }

  getCognitoIdentity(): string {
    return this.cognitoCreds.identityId;
  }

  getAccessToken(): Observable<string> {
    const observable = Observable.create(observer => {
      let result: string = null;
      if (this.getCurrentUser() != null) {
        this.getCurrentUser().getSession((err, session) => {
          if (err) {
            console.log("CognitoUtil: Can't set the credentials:" + err);
          }
          else {
            if (session.isValid()) {
              result = session.getAccessToken().getJwtToken();
            }
          }
        });
      }
      observer.next(result);
      observer.complete();
    });

    return observable;
  }

  getIdToken(): Observable<string> {
    const observable = Observable.create(observer => {
      let result: string = null;
      if (this.getCurrentUser() != null) {
        this.getCurrentUser().getSession((err, session) => {
          if (err) {
            console.log("CognitoUtil: Can't set the credentials:" + err);
          }
          else {
            if (session.isValid()) {
              result = session.getIdToken().getJwtToken();
            } else {
              console.log("CognitoUtil: Got the id token, but the session isn't valid");
            }
          }
        });
      }

      observer.next(result);
      observer.complete();
    });

    return observable;
  }

  getRefreshToken(): Observable<string> {
    const observable = Observable.create(observer => {
      let result: string = null;
      if (this.getCurrentUser() != null) {
        this.getCurrentUser().getSession((err, session) => {
          if (err) {
            console.log("CognitoUtil: Can't set the credentials:" + err);
          }
          else {
            if (session.isValid()) {
              result = session.getRefreshToken();
            }
          }
        });
      }

      observer.next(result);
      observer.complete();
    });

    return observable;
  }

  refresh(): void {
    this.getCurrentUser().getSession((err, session) => {
      if (err) {
        console.log("CognitoUtil: Can't set the credentials:" + err);
      }

      else {
        if (session.isValid()) {
          console.log("CognitoUtil: refreshed successfully");
        } else {
          console.log("CognitoUtil: refreshed but session is still not valid");
        }
      }
    });
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  logout(): void {
    this.getCurrentUser().signOut();
    this.router.navigate(['/']);
  }
}
