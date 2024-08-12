import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

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
         storeAuthStateInCookie: isIE,
     },
     system: {
         loggerOptions: {
            loggerCallback: (logLevel, message, containsPii) => {
                console.log(message);
             },
             logLevel: LogLevel.Verbose,
             piiLoggingEnabled: false
         }
     }
 }

export const loginRequest = {
  scopes: []
};
