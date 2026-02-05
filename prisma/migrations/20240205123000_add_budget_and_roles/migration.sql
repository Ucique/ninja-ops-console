-- Add role to user
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'OWNER';

-- Create BudgetSettings table
CREATE TABLE "BudgetSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "monthlyLimit" REAL NOT NULL DEFAULT 5000,
    "weeklyLimit" REAL,
    "resetDay" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BudgetSettings_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "BudgetSettings_ownerId_key" ON "BudgetSettings"("ownerId");

-- Create Expense table
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "note" TEXT,
    "date" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    "settingsId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Expense_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Expense_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "BudgetSettings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "Expense_settingsId_idx" ON "Expense"("settingsId");
