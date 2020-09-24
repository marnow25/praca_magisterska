import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component'
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { UserComponent } from './user/user.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from './auth/auth.guard'
import { UploadDownloadComponent } from './upload-download/upload-download.component'
import { TimelineComponent } from './timeline/timeline.component';
import { TimelinesContainerComponent } from './timelines-container/timelines-container.component'

const routes: Routes = [
  // {
  //   path: 'signup', component: UserComponent,
  //   children: [{ path: '', component: SignUpComponent }]
  // },
  // {
  //   path: 'login', component: UserComponent,
  //   children: [{ path: '', component: SignInComponent }]
  // },
  {
    path: '', component: TimelinesContainerComponent
  },
  {
    path: 'userprofile', component: UserProfileComponent, canActivate: [AuthGuard]
  },
  {
    path: 'upload', component: UploadDownloadComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
