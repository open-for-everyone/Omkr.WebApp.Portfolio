import {
  MsalInterceptorConfiguration,
  ProtectedResourceScopes,
} from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import {
} from './auth-config';
import { environment } from 'src/environments/environment';

/**
 * MSAL Angular will automatically retrieve tokens for resources
 * added to protectedResourceMap. For more info, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/initialization.md#get-tokens-for-web-api-calls
 */
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<
    string,
    Array<string | ProtectedResourceScopes> | null
  >();

  protectedResourceMap.set(environment.endpoints.weather, [
    {
      httpMethod: 'GET',
      scopes: environment.scopes.weather,
    },
    {
      httpMethod: 'POST',
      scopes: environment.scopes.weather,
    },
    {
      httpMethod: 'PUT',
      scopes: environment.scopes.weather,
    },
    {
      httpMethod: 'DELETE',
      scopes: environment.scopes.weather,
    },
    {
      httpMethod: 'PATCH',
      scopes: environment.scopes.weather,
    },
  ]);


  protectedResourceMap.set(environment.endpoints.user, [
    {
      httpMethod: 'GET',
      scopes: environment.scopes.user,
    },
    {
      httpMethod: 'POST',
      scopes: environment.scopes.user,
    },
    {
      httpMethod: 'PUT',
      scopes: environment.scopes.user,
    },
    {
      httpMethod: 'DELETE',
      scopes: environment.scopes.user,
    },
    {
      httpMethod: 'PATCH',
      scopes: environment.scopes.user,
    },
  ]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}
