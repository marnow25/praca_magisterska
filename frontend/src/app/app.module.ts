//built-in
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { MatVideoModule } from 'mat-video';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import {
  NgxMatDatetimePickerModule, 
  NgxMatNativeDateModule, 
  NgxMatTimepickerModule 
} from '@angular-material-components/datetime-picker';

import { DragDropModule } from '@angular/cdk/drag-drop'

// angular materials
import { 
  MatNativeDateModule, 
  MatInputModule, 
  MatIconModule,
  MatButtonModule
  } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCarouselModule } from '@ngmodule/material-carousel';

//components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { UserService } from './shared/user.service';
import { MainPageComponent } from './main-page/main-page.component';
import { TimelineComponent } from './timeline/timeline.component';
import { TimelinesContainerComponent } from './timelines-container/timelines-container.component';
import { FilterFormComponent } from './filter-form/filter-form.component';
import { UploadDownloadComponent } from './upload-download/upload-download.component';

// other
import { AuthGuard } from './auth/auth.guard'
import { AuthInterceptor } from './auth/auth.interceptor'

// videogular2
import { VgCoreModule } from 'videogular2/compiled/core'
import { VgControlsModule } from 'videogular2/compiled/controls';
import { VgOverlayPlayModule } from 'videogular2/compiled/overlay-play';
import { VgBufferingModule } from 'videogular2/compiled/buffering';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    UserComponent,
    SignUpComponent,
    UserProfileComponent,
    SignInComponent,
    MainPageComponent,
    UploadDownloadComponent,
    FileSelectDirective, 
    FileDropDirective, 
    TimelineComponent, 
    TimelinesContainerComponent, FilterFormComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    MatVideoModule,
    NgxMaterialTimepickerModule,
    NgxMatDatetimePickerModule,
    DragDropModule,

    // Angular materials
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDatepickerModule,
    MatButtonModule,
    MatCarouselModule.forRoot(),

    // videogular2
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    BrowserAnimationsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }, AuthGuard, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
