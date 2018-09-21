import {AbpSessionService} from '@abp/session/abp-session.service';
import {Component, Injector, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppComponentBase} from '../../../../shared/common/app-component-base';
import {SessionServiceProxy, UpdateUserSignInTokenOutput} from '../../../../shared/service-proxies/service-proxies';
import {UrlHelper} from 'shared/helpers/UrlHelper';
import {ExternalLoginProvider, LoginService} from './login.service';

@Component({
    selector: 'loginModal',
    templateUrl: './login.component.html'
})
export class LoginComponent extends AppComponentBase implements OnInit {
    submitting = false;

    constructor(
        injector: Injector,
        public loginService: LoginService,
        private _router: Router,
        private _sessionService: AbpSessionService,
        private _sessionAppService: SessionServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        if (this._sessionService.userId > 0 && UrlHelper.getReturnUrl() && UrlHelper.getSingleSignIn()) {
            this._sessionAppService.updateUserSignInToken()
                .subscribe((result: UpdateUserSignInTokenOutput) => {
                    const initialReturnUrl = UrlHelper.getReturnUrl();
                    const returnUrl = initialReturnUrl + (initialReturnUrl.indexOf('?') >= 0 ? '&' : '?') +
                        'accessToken=' + result.signInToken +
                        '&userId=' + result.encodedUserId +
                        '&tenantId=' + result.encodedTenantId;

                    location.href = returnUrl;
                });
        }
    }

    login(): void {
        abp.ui.setBusy();
        this.submitting = true;
        this.loginService.authenticate(
            () => {
                abp.ui.clearBusy();
                this.submitting = false;
            }
        );
    }

    externalLogin(provider: ExternalLoginProvider) {
        this.loginService.externalAuthenticate(provider);
    }
}
