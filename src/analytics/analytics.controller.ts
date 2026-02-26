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
import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('counts')
  async getCounts() {
    return this.analyticsService.getCounts();
  }

  @Get('complaint-status-counts')
  async getComplaintStatusCounts() {
    return this.analyticsService.getComplaintStatusCounts();
  }
}
