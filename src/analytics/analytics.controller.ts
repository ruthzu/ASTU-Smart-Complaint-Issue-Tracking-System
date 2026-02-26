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
