import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { LoaderInterceptor } from './interceptors/loader.interceptor';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    AutocompleteComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    ScrollingModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '',   redirectTo: '/home', pathMatch: 'full' }, // redirect to `first-component`
      { path: 'home', component: HomeComponent, pathMatch: 'full' },
      { path: '**', redirectTo: '/home', pathMatch: 'full' },
    ])
  ],
  providers: [
    HttpClientModule,
    // Implementing of LoaderInterceptor - for (Show, Hide) loader on every request
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
