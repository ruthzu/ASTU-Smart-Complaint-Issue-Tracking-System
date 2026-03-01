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
exports.ComplaintController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const complaint_file_upload_options_1 = require("./complaint-file-upload.options");
const common_2 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_complaint_dto_1 = require("./create-complaint.dto");
const assign_department_dto_1 = require("./assign-department.dto");
const complaint_service_1 = require("./complaint.service");
const update_complaint_dto_1 = require("./update-complaint.dto");
let ComplaintController = class ComplaintController {
    complaintService;
    constructor(complaintService) {
        this.complaintService = complaintService;
    }
    async createComplaint(createComplaintDto, file, request) {
        const user = request.user;
        if (!user?.id) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        // Additional manual validation (should not be needed, but for safety)
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.mimetype)) {
                throw new common_1.BadRequestException('Only jpg, png, and pdf files are allowed');
            }
            if (file.size > 5 * 1024 * 1024) {
                throw new common_1.BadRequestException('File size exceeds 5MB');
            }
        }
        const dto = { ...createComplaintDto };
        if (file?.filename) {
            dto.attachment = file.filename;
        }
        return this.complaintService.createComplaint(dto, user.id);
    }
    async listComplaints(page = '1', limit = '10') {
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, parseInt(limit, 10) || 10);
        return this.complaintService.listComplaintsPaginated(pageNum, limitNum);
    }
    async listComplaintsForStaff(request, departmentId) {
        const user = request.user;
        if (!user?.id || !user.role) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        let deptId;
        if (departmentId !== undefined) {
            const parsed = Number(departmentId);
            if (Number.isNaN(parsed) || parsed < 1) {
                throw new common_1.BadRequestException('departmentId must be a positive number');
            }
            deptId = parsed;
        }
        return this.complaintService.listComplaintsForUser({ id: user.id, role: user.role }, deptId);
    }
    async updateComplaint(id, updateComplaintDto, request) {
        const user = request.user;
        if (!user?.id || !user.role) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        return this.complaintService.updateComplaint(id, updateComplaintDto, { id: user.id, role: user.role });
    }
    async assignDepartment(id, assignDepartmentDto) {
        return this.complaintService.assignDepartment(id, assignDepartmentDto);
    }
};
exports.ComplaintController = ComplaintController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', complaint_file_upload_options_1.complaintFileMulterOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_2.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_complaint_dto_1.CreateComplaintDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ComplaintController.prototype, "createComplaint", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ComplaintController.prototype, "listComplaints", null);
__decorate([
    (0, common_1.Get)('staff'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.STAFF, client_1.Role.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('departmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ComplaintController.prototype, "listComplaintsForStaff", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.STAFF, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_complaint_dto_1.UpdateComplaintDto, Object]),
    __metadata("design:returntype", Promise)
], ComplaintController.prototype, "updateComplaint", null);
__decorate([
    (0, common_1.Patch)(':id/assign-department'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, assign_department_dto_1.AssignDepartmentDto]),
    __metadata("design:returntype", Promise)
], ComplaintController.prototype, "assignDepartment", null);
exports.ComplaintController = ComplaintController = __decorate([
    (0, common_1.Controller)('complaints'),
    __metadata("design:paramtypes", [complaint_service_1.ComplaintService])
], ComplaintController);
//# sourceMappingURL=complaint.controller.js.map