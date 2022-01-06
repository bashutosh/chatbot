import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AutofocusDirective} from './autofocus.directive';
import {NgSelectModule} from '@ng-select/ng-select';
import {DpDatePickerModule} from 'ng2-date-picker';
import {HtmlContentComponent} from './htmlContent/html-content/html-content.component';
import {SafeHtmlPipe} from './htmlContent/html-content/safe.pipe';
@NgModule({
  declarations: [
    AppComponent,
    HtmlContentComponent,
    SafeHtmlPipe,
    AutofocusDirective
  ],
  imports: [
    BrowserModule,
    NgSelectModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    DpDatePickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
