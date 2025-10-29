import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; 

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideNgxWebstorage, withLocalStorage, withSessionStorage } from 'ngx-webstorage';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()), 
    provideClientHydration(withEventReplay()), 
    provideCharts(withDefaultRegisterables()),  
     provideNgxWebstorage(withLocalStorage()),
    provideNgxWebstorage(withSessionStorage()) 
  ]
};
