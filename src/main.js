"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const all_exceptions_filter_1 = require("./common/all-exceptions.filter");
const config_1 = require("@nestjs/config");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const complaint_module_1 = require("./complaint/complaint.module");
const department_module_1 = require("./department/department.module");
const notification_module_1 = require("./notification/notification.module");
const openai_module_1 = require("./openai/openai.module");
const analytics_module_1 = require("./analytics/analytics.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true, // makes config available everywhere
            }),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            complaint_module_1.ComplaintModule,
            department_module_1.DepartmentModule,
            notification_module_1.NotificationModule,
            openai_module_1.OpenAIModule,
            analytics_module_1.AnalyticsModule,
        ],
    })
], AppModule);
async function bootstrap() {
    const app = await core_1.NestFactory.create(AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map