import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("change-me", 10);
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Ops Admin",
      passwordHash,
      mustChangePassword: true,
      settings: {
        create: {},
      },
    },
  });

  const project = await prisma.project.create({
    data: {
      name: "Affiliate Mission Control",
      description: "Launch and optimize OpenClaw affiliate operations.",
      ownerId: user.id,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Finalize offer shortlist",
        description: "Rank partner programs by EPC and approval speed.",
        status: "Backlog",
        priority: "High",
        urgency: "High",
        ownerId: user.id,
        projectId: project.id,
      },
      {
        title: "Build landing page v1",
        status: "In Progress",
        priority: "High",
        urgency: "Urgent",
        ownerId: user.id,
        projectId: project.id,
      },
      {
        title: "Compliance review for paid spend",
        status: "Waiting for Approval",
        priority: "Medium",
        urgency: "Normal",
        ownerId: user.id,
        approvalsRequired: true,
        projectId: project.id,
      },
    ],
  });

  await prisma.approvalItem.create({
    data: {
      title: "Approve Q3 campaign budget",
      type: "spend",
      status: "pending",
      ownerId: user.id,
    },
  });

  await prisma.idea.createMany({
    data: [
      { title: "Lead magnet for affiliate onboarding", description: "Create a PDF checklist for new partners." },
      { title: "Automated weekly revenue recap", description: "Send summary to stakeholders." },
    ],
  });

  await prisma.affiliateProgram.create({
    data: {
      name: "OpenClaw Premium",
      network: "PartnerStack",
      commission: "35% recurring",
      cookieDays: 30,
      status: "approved",
      notes: "Top priority program",
      links: {
        create: {
          label: "Homepage CTA",
          destination: "https://openclaw.io/signup",
          utmTemplate: "utm_source=affiliate&utm_medium=referral&utm_campaign=openclaw",
          tags: "hero,landing",
          whereUsed: "Landing page hero",
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "seed",
      entity: "system",
      entityId: "seed",
      message: "Seed data loaded",
      userId: user.id,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
