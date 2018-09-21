import {Component, Injector, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppComponentBase} from '@shared/common/app-component-base';
import {AppUrlService} from '@shared/common/nav/app-url.service';
import {AppSessionService} from '@shared/common/session/app-session.service';
import {AccountServiceProxy, PasswordComplexitySetting, ProfileServiceProxy, ResetPasswordOutput, ResolveTenantIdInput} from '@shared/service-proxies/service-proxies';
import {LoginService} from './login.service';
import {ResetPasswordModel} from './reset-password.model';
import {finalize} from 'rxjs/operators';
import {ModalDirective} from '@node_modules/ngx-bootstrap';

@Component({
    selector: 'resetModal',
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent extends AppComponentBase {

    @ViewChild('resetModal') resetModal: ModalDirective;
    model: ResetPasswordModel = new ResetPasswordModel();
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    saving = false;

    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _loginService: LoginService,
        private _appUrlService: AppUrlService,
        private _appSessionService: AppSessionService,
        private _profileService: ProfileServiceProxy
    ) {
        super(injector);
    }

    show(userid, code): void {
        this.model.userId = userid;
        this.model.resetCode = code;
        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
            this.resetModal.show();
        });
    }

    save(): void {
        this.saving = true;
        abp.ui.setBusy();
        this._accountService.resetPassword(this.model)
            .pipe(finalize(() => {
                this.saving = false;
            }))
            .subscribe((result: ResetPasswordOutput) => {
                if (!result.canLogin) {
                    this._router.navigate(['/']);
                    return;
                }

                // Autheticate
                this.saving = true;
                this._loginService.authenticateModel.userNameOrEmailAddress = result.userName;
                this._loginService.authenticateModel.password = this.model.password;
                this._loginService.authenticate(() => {
                    this.saving = false;
                });
                abp.ui.clearBusy();
            });
    }

    close(): void {
        this.resetModal.hide();
    }
}
