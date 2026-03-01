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
exports.DepartmentService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let DepartmentService = class DepartmentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDepartmentDto) {
        return this.prisma.department.create({
            data: {
                name: createDepartmentDto.name,
                description: createDepartmentDto.description ?? null,
            },
        });
    }
    async findAll() {
        return this.prisma.department.findMany();
    }
    async update(id, updateDepartmentDto) {
        try {
            return await this.prisma.department.update({
                where: { id },
                data: updateDepartmentDto,
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new common_1.NotFoundException('Department not found');
            }
            throw error;
        }
    }
    async remove(id) {
        try {
            await this.prisma.department.delete({ where: { id } });
            return { message: 'Department deleted successfully' };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new common_1.NotFoundException('Department not found');
            }
            throw error;
        }
    }
};
exports.DepartmentService = DepartmentService;
exports.DepartmentService = DepartmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DepartmentService);
//# sourceMappingURL=department.service.js.map