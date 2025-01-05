-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "category" TEXT NOT NULL DEFAULT 'PENGUMUMAN',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "post_reactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'LIKE',
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "post_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "post_reactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookmarks_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'COMMENT',
    "userId" TEXT NOT NULL,
    "postId" TEXT,
    "commentId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "notifications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "notifications_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ANAK_REMAS',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "groupId" TEXT,
    "avatar" TEXT DEFAULT '/avatars/avatar-01.jpg',
    "tanggalLahir" DATETIME,
    "nomerWhatsapp" TEXT,
    "alamatRumah" TEXT,
    "rwRumah" TEXT,
    "rtRumah" TEXT,
    "sekolah" TEXT,
    "keterangan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "orang_tua_anak_remas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orangTuaId" TEXT NOT NULL,
    "anakRemasId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "orang_tua_anak_remas_orangTuaId_fkey" FOREIGN KEY ("orangTuaId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orang_tua_anak_remas_anakRemasId_fkey" FOREIGN KEY ("anakRemasId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "post_views" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "post_views_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "post_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "posts_category_idx" ON "posts"("category");

-- CreateIndex
CREATE INDEX "posts_status_idx" ON "posts"("status");

-- CreateIndex
CREATE INDEX "posts_isPinned_idx" ON "posts"("isPinned");

-- CreateIndex
CREATE INDEX "posts_createdAt_idx" ON "posts"("createdAt");

-- CreateIndex
CREATE INDEX "posts_authorId_idx" ON "posts"("authorId");

-- CreateIndex
CREATE INDEX "posts_isApproved_idx" ON "posts"("isApproved");

-- CreateIndex
CREATE INDEX "comments_postId_idx" ON "comments"("postId");

-- CreateIndex
CREATE INDEX "comments_parentId_idx" ON "comments"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "post_reactions_userId_postId_key" ON "post_reactions"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_userId_postId_key" ON "bookmarks"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "orang_tua_anak_remas_orangTuaId_anakRemasId_key" ON "orang_tua_anak_remas"("orangTuaId", "anakRemasId");

-- CreateIndex
CREATE INDEX "post_views_postId_idx" ON "post_views"("postId");

-- CreateIndex
CREATE INDEX "post_views_userId_idx" ON "post_views"("userId");
