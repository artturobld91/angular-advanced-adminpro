import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

//Modules
import { PagesroutingModule } from './pages/pages.routing';
import { AuthroutingModule } from './auth/auth.routing';


//Components
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

const routes: Routes = [
  
  // path: '/dashboard' PagesRouting
  // path: '/auth' AuthRouting
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component : NopagefoundComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot( routes ),
    PagesroutingModule,
    AuthroutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
