-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'AKHLAK',
    "type" TEXT NOT NULL DEFAULT 'TAMBAHAN',
    "userCategories" TEXT NOT NULL DEFAULT 'mkidz',
    "minFrequency" INTEGER NOT NULL DEFAULT 1,
    "maxFrequency" INTEGER NOT NULL,
    "basePoints" INTEGER NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isNegative" BOOLEAN NOT NULL DEFAULT false,
    "needsProof" BOOLEAN NOT NULL DEFAULT false,
    "validationRoles" TEXT NOT NULL DEFAULT 'KOORDINATOR_ANAKREMAS',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "points" INTEGER NOT NULL,
    "multiplier" REAL NOT NULL DEFAULT 1,
    "finalPoints" INTEGER NOT NULL,
    "proof" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "validatedById" TEXT,
    "validatedAt" DATETIME,
    "rejectionReason" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserActivity_validatedById_fkey" FOREIGN KEY ("validatedById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "conditions" TEXT NOT NULL,
    "multiplier" REAL NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserStreak" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "maxStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivity" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserStreak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "skorTotal" INTEGER NOT NULL,
    "skorPositif" INTEGER NOT NULL DEFAULT 0,
    "skorNegatif" INTEGER NOT NULL DEFAULT 0,
    "utamaDone" INTEGER NOT NULL DEFAULT 0,
    "tambahanDone" INTEGER NOT NULL DEFAULT 0,
    "trophy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeeklyScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "totalPoints" INTEGER NOT NULL,
    "skorPositif" INTEGER NOT NULL DEFAULT 0,
    "skorNegatif" INTEGER NOT NULL DEFAULT 0,
    "trophy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WeeklyScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MonthlyScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "totalPoints" INTEGER NOT NULL,
    "skorPositif" INTEGER NOT NULL DEFAULT 0,
    "skorNegatif" INTEGER NOT NULL DEFAULT 0,
    "trophy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MonthlyScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityTarget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userCategory" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "minDaily" INTEGER NOT NULL DEFAULT 0,
    "maxDaily" INTEGER NOT NULL,
    "pointMultiplier" REAL NOT NULL DEFAULT 1.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ActivityTarget_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserLevel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "skorTotal" INTEGER NOT NULL DEFAULT 0,
    "skorPositif" INTEGER NOT NULL DEFAULT 0,
    "skorNegatif" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserLevel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserPenalty" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserPenalty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityCombo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "activities" TEXT NOT NULL,
    "multiplier" REAL NOT NULL,
    "timeWindow" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ActivityCombo_activities_fkey" FOREIGN KEY ("activities") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityValidator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activityId" TEXT NOT NULL,
    "validatorId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ActivityValidator_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ActivityValidator_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityValidationHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userActivityId" TEXT NOT NULL,
    "validatorId" TEXT NOT NULL,
    "oldStatus" TEXT NOT NULL,
    "newStatus" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityValidationHistory_userActivityId_fkey" FOREIGN KEY ("userActivityId") REFERENCES "UserActivity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ActivityValidationHistory_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "UserActivity_userId_date_idx" ON "UserActivity"("userId", "date");

-- CreateIndex
CREATE INDEX "UserActivity_status_idx" ON "UserActivity"("status");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyScore_userId_weekNumber_year_key" ON "WeeklyScore"("userId", "weekNumber", "year");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyScore_userId_month_year_key" ON "MonthlyScore"("userId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityTarget_userCategory_activityId_key" ON "ActivityTarget"("userCategory", "activityId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLevel_userId_key" ON "UserLevel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityValidator_activityId_validatorId_key" ON "ActivityValidator"("activityId", "validatorId");

-- CreateIndex
CREATE INDEX "ActivityValidationHistory_userActivityId_idx" ON "ActivityValidationHistory"("userActivityId");
