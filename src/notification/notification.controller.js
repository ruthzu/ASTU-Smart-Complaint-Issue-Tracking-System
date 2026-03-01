"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const notification_service_1 = require("./notification.service");
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async listNotifications(request, page, limit, unread) {
        const user = request.user;
        if (!user?.id) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        const pageNum = page ? Number(page) : 1;
        const limitNum = limit ? Number(limit) : 10;
        if (!Number.isInteger(pageNum) || pageNum < 1) {
            throw new common_1.BadRequestException('page must be a positive integer');
        }
        if (!Number.isInteger(limitNum) || limitNum < 1) {
            throw new common_1.BadRequestException('limit must be a positive integer');
        }
        let unreadFlag;
        if (unread !== undefined) {
            if (unread === 'true') {
                unreadFlag = true;
            }
            else if (unread === 'false') {
                unreadFlag = false;
            }
            else {
                throw new common_1.BadRequestException('unread must be true or false');
            }
        }
        const result = await this.notificationService.getNotificationsForUser(user.id, pageNum, limitNum, unreadFlag);
        return {
            total: result.total,
            page: result.page,
            limit: result.limit,
            items: result.items,
        };
    }
    async markAsRead(id, request) {
        const user = request.user;
        if (!user?.id) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        return this.notificationService.markNotificationAsRead(id, user.id);
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('unread')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "listNotifications", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map