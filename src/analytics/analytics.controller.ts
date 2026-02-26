      @Get('complaints-per-staff')
      async getComplaintsPerStaff() {
        return this.analyticsService.getComplaintsPerStaff();
      }
    @Get('resolution-rate')
    async getResolutionRate() {
      return this.analyticsService.getResolutionRate();
    }
  @Get('complaints-by-category-or-department')
  async getComplaintsByCategoryOrDepartment() {
    return this.analyticsService.getComplaintsByCategoryOrDepartment();
  }

import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}
  @Get()
  @Roles('ADMIN')
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

  @Get('counts')
  async getCounts() {
    return this.analyticsService.getCounts();
  }

  @Get('complaint-status-counts')
  async getComplaintStatusCounts() {
    return this.analyticsService.getComplaintStatusCounts();
  }
}
