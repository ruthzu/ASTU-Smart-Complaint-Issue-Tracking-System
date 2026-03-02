const { PrismaClient, Role, ComplaintStatus } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const staffPassword = await bcrypt.hash('Staff@123', 10);
  const studentPassword = await bcrypt.hash('Student@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@astu.edu.et' },
    update: { name: 'System Admin', role: Role.ADMIN },
    create: {
      name: 'System Admin',
      email: 'admin@astu.edu.et',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@astu.edu.et' },
    update: { name: 'Support Staff', role: Role.STAFF },
    create: {
      name: 'Support Staff',
      email: 'staff@astu.edu.et',
      password: staffPassword,
      role: Role.STAFF,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@astu.edu.et' },
    update: { name: 'Test Student', role: Role.STUDENT },
    create: {
      name: 'Test Student',
      email: 'student@astu.edu.et',
      password: studentPassword,
      role: Role.STUDENT,
    },
  });

  const itDepartment = await prisma.department.upsert({
    where: { name: 'IT Support' },
    update: { description: 'Information technology support' },
    create: {
      name: 'IT Support',
      description: 'Information technology support',
    },
  });

  await prisma.complaint.upsert({
    where: { id: 1 },
    update: {
      title: 'WiFi issue in dormitory',
      description: 'Internet is unstable in Dorm Block A.',
      category: 'Network',
      status: ComplaintStatus.OPEN,
      userId: student.id,
      assignedStaffId: staff.id,
      departmentId: itDepartment.id,
    },
    create: {
      id: 1,
      title: 'WiFi issue in dormitory',
      description: 'Internet is unstable in Dorm Block A.',
      category: 'Network',
      status: ComplaintStatus.OPEN,
      userId: student.id,
      assignedStaffId: staff.id,
      departmentId: itDepartment.id,
    },
  });

  const existingSeedNotification = await prisma.notification.findFirst({
    where: {
      userId: admin.id,
      message: 'Seed data initialized successfully.',
    },
  });

  if (!existingSeedNotification) {
    await prisma.notification.create({
      data: {
        userId: admin.id,
        message: 'Seed data initialized successfully.',
      },
    });
  }

  console.log('Seeding completed.');
  console.log('Admin: admin@astu.edu.et / Admin@123');
  console.log('Staff: staff@astu.edu.et / Staff@123');
  console.log('Student: student@astu.edu.et / Student@123');
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
