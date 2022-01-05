// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrlAuthenticate: "http://localhost:8080/authenticate",
  apiUrlCheckAuth: "http://localhost:8080/check-auth",
  apiUrlLogout: "http://localhost:8080/logout",
  apiUrlRegister: "http://localhost:8080/register",
  apiUrlEmailAvailable: "http://localhost:8080/email-available",
  apiUrlUsernameAvailable: "http://localhost:8080/username-available",
  apiUrlVerifyAccount: "http://localhost:8080/confirm-registration?token=",
  onlineQrCodeBaseUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
