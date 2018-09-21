import { AfterViewInit, Component, Injector, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { SubscriptionStartType } from '@shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import * as moment from 'moment';
import { AppComponentBase } from 'shared/common/app-component-base';
declare var App: any;

@Component({
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent extends AppComponentBase implements OnInit, AfterViewInit {

    private viewContainerRef: ViewContainerRef;
    private router: Router;

    subscriptionStartType = SubscriptionStartType;
    installationMode = true;


    public constructor(
        injector: Injector,
        viewContainerRef: ViewContainerRef,
        private _router: Router,
        private _appSessionService: AppSessionService) {
        super(injector);
        this.viewContainerRef = viewContainerRef; // You need this small hack in order to catch application root view container ref (required by ng2 bootstrap modal)
        this.router = _router;
    }

    ngOnInit(): void {
        this.installationMode = UrlHelper.isInstallUrl(location.href);


    }

    subscriptionStatusBarVisible(): boolean {
        return this._appSessionService.tenantId > 0 &&
            (this._appSessionService.tenant.isInTrialPeriod ||
                this.subscriptionIsExpiringSoon());
    }

    subscriptionIsExpiringSoon(): boolean {
        if (this._appSessionService.tenant.subscriptionEndDateUtc) {
            return moment().utc().add(AppConsts.subscriptionExpireNootifyDayCount, 'days') >= moment(this._appSessionService.tenant.subscriptionEndDateUtc);
        }

        return false;
    }

    ngAfterViewInit(): void {
        App.init(); // init core
    }
}
