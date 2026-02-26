
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Prisma, Role, ComplaintStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';


@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}


  /**
   * Create notification and send email for complaint events
   * Example usage for:
   * 1. Complaint created: send to all admins
   * 2. Complaint assigned: send to assigned staff
   * 3. Complaint status updated: send to student
   */
  async createNotification(userId: string, message: string, emailOptions?: { to?: string, subject?: string, html?: string }) {
    const parsedUserId = Number(userId);
    if (!Number.isInteger(parsedUserId)) {
      throw new BadRequestException('Invalid userId');
    }

    // Send email if options provided
    if (emailOptions?.to && emailOptions.subject && emailOptions.html) {
      this.emailService.sendMail(emailOptions.to, emailOptions.subject, emailOptions.html)
        .catch(err => this.logger.error(`Failed to send email to ${emailOptions.to}: ${err.message}`));
    }

    return this.prisma.notification.create({
      data: { userId: parsedUserId, message },
    });
  }

  // Example: Send email to all admins when complaint is created
  async notifyAdminsOnComplaintCreated(complaint: { title: string, description: string }) {
    const admins = await this.prisma.user.findMany({ where: { role: Role.ADMIN } });
    await Promise.all(admins.map(admin =>
      this.createNotification(
        admin.id.toString(),
        `New complaint submitted: ${complaint.title}`,
        admin.email ? {
          to: admin.email,
          subject: 'New Complaint Submitted',
          html: `<p>A new complaint was submitted: <b>${complaint.title}</b></p><p>${complaint.description}</p>`
        } : undefined
      )
    ));
  }

  // Example: Send email to assigned staff when complaint is assigned
  async notifyStaffOnComplaintAssigned(staffId: number, complaint: { title: string, description: string }) {
    const staff = await this.prisma.user.findUnique({ where: { id: staffId } });
    if (staff && staff.email) {
      await this.createNotification(
        staff.id.toString(),
        `You have been assigned a complaint: ${complaint.title}`,
        {
          to: staff.email,
          subject: 'Complaint Assigned',
          html: `<p>You have been assigned a complaint: <b>${complaint.title}</b></p><p>${complaint.description}</p>`
        }
      );
    }
  }

  // Example: Send email to student when complaint status is updated
  async notifyStudentOnStatusUpdate(studentId: number, complaint: { title: string, status: ComplaintStatus, email: string }) {
    if (complaint.email) {
      await this.createNotification(
        studentId.toString(),
        `Your complaint status changed to ${complaint.status}`,
        {
          to: complaint.email,
          subject: 'Complaint Status Updated',
          html: `<p>Your complaint <b>${complaint.title}</b> status changed to <b>${complaint.status}</b>.</p>`
        }
      );
    }
  }

  async getNotificationsForUser(userId: number, page = 1, limit = 10, unread?: boolean) {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('page and limit must be positive');
    }

    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = { userId };
    if (unread === true) {
      where.isRead = false;
    } else if (unread === false) {
      where.isRead = true;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async markNotificationAsRead(id: string, userId: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Not authorized to modify this notification');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
