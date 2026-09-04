import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';
import { isDevMode } from '@angular/core';
import { environment } from 'src/environments/environment';

export const b2cPolicies = {
     names: {
         signUpSignIn: environment.AzureAdB2C.policies.signupSignIn,
        //  editProfile: flowNames.profileEdit
     },
     authorities: {
         signUpSignIn: {
             authority: `https://${environment.AzureAdB2C.tenantName}.b2clogin.com/${environment.AzureAdB2C.tenantName}.onmicrosoft.com/${environment.AzureAdB2C.policies.signupSignIn}`,
         }
     },
     authorityDomain: `${environment.AzureAdB2C.tenantName}.b2clogin.com`
 };


export const msalConfig: Configuration = {
     auth: {
         clientId: environment.AzureAdB2C.clientId,
         authority: b2cPolicies.authorities.signUpSignIn.authority,
         knownAuthorities: [b2cPolicies.authorityDomain],
         redirectUri: '/',
         postLogoutRedirectUri: '/',
     },
     cache: {
         cacheLocation: BrowserCacheLocation.LocalStorage,
     },
     system: {
         /*
           MSAL used to log at Verbose through `console.log`, which meant the deployed site printed a
           running commentary of every token operation into the visitor's console. Errors are worth
           surfacing; the rest is only useful while developing.
         */
         loggerOptions: {
             loggerCallback: (logLevel, message) => {
                 if (logLevel === LogLevel.Error) {
                     console.error(message);
                 } else if (isDevMode()) {
                     console.debug(message);
                 }
             },
             logLevel: isDevMode() ? LogLevel.Info : LogLevel.Error,
             piiLoggingEnabled: false
         }
     }
 }

export const loginRequest = {
  scopes: []
};
