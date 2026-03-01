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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getAllAnalytics() {
        const [counts, statusCounts, catDeptCounts, resolutionRate, perStaff] = await Promise.all([
            this.analyticsService.getCounts(),
            this.analyticsService.getComplaintStatusCounts(),
            this.analyticsService.getComplaintsByCategoryOrDepartment(),
            this.analyticsService.getResolutionRate(),
            this.analyticsService.getComplaintsPerStaff(),
        ]);
        return {
            totalComplaints: counts.complaints,
            statusCounts,
            categoryCounts: catDeptCounts.categoryCounts,
            departmentCounts: catDeptCounts.departmentCounts,
            resolutionRates: resolutionRate,
            complaintsPerStaff: perStaff,
        };
    }
    async getComplaintsPerStaff() {
        return this.analyticsService.getComplaintsPerStaff();
    }
    async getResolutionRate() {
        return this.analyticsService.getResolutionRate();
    }
    async getComplaintsByCategoryOrDepartment() {
        return this.analyticsService.getComplaintsByCategoryOrDepartment();
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getAllAnalytics", null);
__decorate([
    (0, common_1.Get)('complaints-per-staff'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getComplaintsPerStaff", null);
__decorate([
    (0, common_1.Get)('resolution-rate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getResolutionRate", null);
__decorate([
    (0, common_1.Get)('complaints-by-category-or-department'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getComplaintsByCategoryOrDepartment", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map