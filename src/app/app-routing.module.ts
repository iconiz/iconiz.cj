import { NgModule } from '@angular/core';
import { NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from './shared/common/auth/auth-route-guard';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'app',
                component: AppComponent,
                children: [
                    {
                        path: 'main',
                        loadChildren: 'app/main/main.module#MainModule', //Lazy load main module
                        data: { preload: true }
                    }, {
                        path: '',
                        children: [
                            { path: '', redirectTo: '/app/main/dashboard', pathMatch: 'full' }
                        ]
                    },
                ]
            }
        ])
    ],
    exports: [RouterModule]
})

export class AppRoutingModule {
    constructor(
        private router: Router
    ) {
        router.events.subscribe((event) => {

            if (event instanceof RouteConfigLoadStart) {
                abp.ui.setBusy();
            }

            if (event instanceof RouteConfigLoadEnd) {
                abp.ui.clearBusy();
            }

            if (event instanceof NavigationEnd) {
                $('meta[property=og\\:url]').attr('content', window.location.href);
            }
        });
    }
}
