import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { UserComponent } from './user/user.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { AuthGuard } from './auth/auth.guard'
import { UploadDownloadComponent } from './upload-download/upload-download.component'
import { TimelinesContainerComponent } from './timelines-container/timelines-container.component'
import { MatrixListContainerComponent } from './matrix-list-container/matrix-list-container.component'
import { FavouriteContainerComponent } from './favourite-container/favourite-container.component'

const routes: Routes = [
  {
    path: 'signup', component: UserComponent,
    children: [{ path: '', component: SignUpComponent }]
  },
  {
    path: 'login', component: UserComponent,
    children: [{ path: '', component: SignInComponent }]
  },
  {
    path: '', component: TimelinesContainerComponent, canActivate: [AuthGuard]
  },
  {
    path: 'upload', component: UploadDownloadComponent, canActivate: [AuthGuard]
  },
  {
    path: 'matrix-list', component: MatrixListContainerComponent, canActivate: [AuthGuard]
  },
  {
    path: 'favourite', component: FavouriteContainerComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
