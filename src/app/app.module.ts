import {AbpModule} from '@abp/abp.module';
import * as ngCommon from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {LoginAttemptsModalComponent} from '@app/shared/layout/login-attempts-modal.component';
import {ChangePasswordModalComponent} from '@app/shared/layout/profile/change-password-modal.component';
import {ChangeProfilePictureModalComponent} from '@app/shared/layout/profile/change-profile-picture-modal.component';
import {MySettingsModalComponent} from '@app/shared/layout/profile/my-settings-modal.component';
import {ServiceProxyModule} from '@shared/service-proxies/service-proxy.module';
import {UtilsModule} from '@shared/utils/utils.module';
import {FileUploadModule} from 'ng2-file-upload';
import {ModalModule, TabsModule, TooltipModule} from 'ngx-bootstrap';
import {FileUploadModule as PrimeNgFileUploadModule, PaginatorModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AppCommonModule} from './shared/common/app-common.module';
import {FooterComponent} from './shared/layout/footer.component';
import {HeaderComponent} from './shared/layout/header.component';
import {LoginComponent} from './shared/layout/account/login.component';
import {LoginService} from './shared/layout/account/login.service';
import {RegisterComponent} from './shared/layout/account/register.component';
import {ForgotPasswordComponent} from './shared/layout/account/forgot-password.component';
import {ResetPasswordComponent} from './shared/layout/account/reset-password.component';
import {BreadCrumbsComponent} from './shared/layout/breadcrumbs.component';
import {SliderComponent} from './shared/layout/slider.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        LoginAttemptsModalComponent,
        ChangePasswordModalComponent,
        ChangeProfilePictureModalComponent,
        MySettingsModalComponent,
        LoginComponent,
        RegisterComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        BreadCrumbsComponent,
        SliderComponent
    ],
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        TabsModule.forRoot(),
        FileUploadModule,
        AbpModule,
        AppRoutingModule,
        UtilsModule,
        AppCommonModule.forRoot(),
        ServiceProxyModule,
        TableModule,
        PaginatorModule,
        PrimeNgFileUploadModule
    ],
    providers: [
        LoginService
    ]
})
export class AppModule {
}
