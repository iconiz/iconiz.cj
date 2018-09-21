import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AppConsts } from '@shared/AppConsts';
import { EditionPaymentType, SubscriptionStartType } from '@shared/AppEnums';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ChangeUserLanguageDto, GetCurrentLoginInformationsOutput, LinkedUserDto, ProfileServiceProxy, SessionServiceProxy, TenantLoginInfoDto, UserLinkServiceProxy, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { LoginAttemptsModalComponent } from './login-attempts-modal.component';
import { ChangePasswordModalComponent } from './profile/change-password-modal.component';
import { ChangeProfilePictureModalComponent } from './profile/change-profile-picture-modal.component';
import { MySettingsModalComponent } from './profile/my-settings-modal.component';

@Component({
    templateUrl: './header.component.html',
    selector: 'header-bar',
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent extends AppComponentBase implements OnInit {

    @ViewChild('loginAttemptsModal') loginAttemptsModal: LoginAttemptsModalComponent;
    @ViewChild('changePasswordModal') changePasswordModal: ChangePasswordModalComponent;
    @ViewChild('changeProfilePictureModal') changeProfilePictureModal: ChangeProfilePictureModalComponent;
    @ViewChild('mySettingsModal') mySettingsModal: MySettingsModalComponent;

    languages: abp.localization.ILanguageInfo[];
    currentLanguage: abp.localization.ILanguageInfo;
    shownLoginName = '';

    tenancyName = '';
    userName = '';

    profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    recentlyLinkedUsers: LinkedUserDto[];

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    tenant: TenantLoginInfoDto = new TenantLoginInfoDto();
    subscriptionStartType = SubscriptionStartType;
    editionPaymentType: typeof EditionPaymentType = EditionPaymentType;

    constructor(
        injector: Injector,
        private _profileServiceProxy: ProfileServiceProxy,
        private _userLinkServiceProxy: UserLinkServiceProxy,
        private _userServiceProxy: UserServiceProxy,
        private _authService: AppAuthService,
        private _sessionService: SessionServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {

        this.languages = _.filter(this.localization.languages, l => (<any>l).isDisabled === false);
        this.currentLanguage = this.localization.currentLanguage;
        if (!this.appSession.user) {
            return;
        }
        this.getCurrentLoginInformations();
        this.getProfilePicture();
        this.getRecentlyLinkedUsers();

        this.registerToEvents();
    }

    registerToEvents() {
        abp.event.on('profilePictureChanged', () => {
            this.getProfilePicture();
        });
    }

    changeLanguage(languageName: string): void {
        const input = new ChangeUserLanguageDto();
        input.languageName = languageName;

        this._profileServiceProxy.changeLanguage(input).subscribe(() => {
            abp.utils.setCookieValue(
                'Abp.Localization.CultureName',
                languageName,
                new Date(new Date().getTime() + 5 * 365 * 86400000), //5 year
                abp.appPath
            );

            window.location.reload();
        });
    }

    getCurrentLoginInformations(): void {
        this.shownLoginName = this.appSession.getShownLoginName();
        this.tenancyName = this.appSession.tenancyName;
        this.userName = this.appSession.user.userName;

        this._sessionService.getCurrentLoginInformations()
            .subscribe((result: GetCurrentLoginInformationsOutput) => {
                this.tenant = result.tenant;
            });
    }

    getProfilePicture(): void {
        this._profileServiceProxy.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

    getRecentlyLinkedUsers(): void {
        this._userLinkServiceProxy.getRecentlyUsedLinkedUsers().subscribe(result => {
            this.recentlyLinkedUsers = result.items;
        });
    }

    showLoginAttempts(): void {
        this.loginAttemptsModal.show();
    }

    changePassword(): void {
        this.changePasswordModal.show();
    }

    changeProfilePicture(): void {
        this.changeProfilePictureModal.show();
    }

    changeMySettings(): void {
        this.mySettingsModal.show();
    }

    logout(): void {
        this._authService.logout();
    }

    onMySettingsModalSaved(): void {
        this.shownLoginName = this.appSession.getShownLoginName();
    }

    isUserLogedin(): boolean{
        return this.appSession.user != null;
    }
}
