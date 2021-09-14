import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromiseComponent } from './promise/promise.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    { 
        path: 'dashboard', 
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
        { path: '', component : DashboardComponent, data: { title: 'Dashboard' }},
        { path: 'progress', component : ProgressComponent, data: { title: 'Progress' }},
        { path: 'grafica1', component : Grafica1Component, data: { title: 'Graph' }},
        { path: 'account-settings', component : AccountSettingsComponent, data: { title: 'Account Settings' }},
        { path: 'promise', component : PromiseComponent, data: { title: 'Promise' }},
        { path: 'rxjs', component : RxjsComponent, data: { title: 'RXJS' }},
        { path: 'profile', component : ProfileComponent, data: { title: 'Profile' }},
        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        ]
  },
  
    //{ path: 'path/:routeParam', component: MyComponent },
    //{ path: 'staticPath', component: ... },
    //{ path: '**', component: ... },
    //{ path: 'oldPath', redirectTo: '/staticPath' },
    //{ path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesroutingModule {}
