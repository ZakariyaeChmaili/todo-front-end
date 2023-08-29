import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthenticationModule } from 'src/app/components/authentication/authentication.module';
import { RouterModule } from '@angular/router';
import { TodoModule } from 'src/app/components/layout/todo.module';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthenticationModule,
    RouterModule,

  ],
  providers: [
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
