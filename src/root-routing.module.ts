import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: '/app/main/dashboard', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class RootRoutingModule {
    constructor(
        private router: Router) {
        router.events.subscribe((event: NavigationEnd) => {});
    }
}
