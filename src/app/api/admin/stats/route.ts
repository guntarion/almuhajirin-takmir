import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getSession } from '../../../../lib/utils/auth';
import { UserRole } from '../../../../lib/types/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total users count
    const totalUsers = await prisma.user.count();
    
    // Get active/inactive users count
    const activeUsers = await prisma.user.count({
      where: { active: true }
    });
    
    const inactiveUsers = totalUsers - activeUsers;
    
    // Get users by role using Prisma's standard query
    const roleStats = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    });
    
    // Convert to required format
    const usersByRole: Record<UserRole, number> = {} as Record<UserRole, number>;
    Object.values(UserRole).forEach(role => {
      usersByRole[role] = 0;
    });
    roleStats.forEach(stat => {
      usersByRole[stat.role as UserRole] = stat._count;
    });
    
    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // SQLite version of date formatting
    const recentRegistrations = await prisma.$queryRaw<Array<{date: string, count: bigint}>>`
      SELECT 
        strftime('%Y-%m-%d', createdAt) as date,
        COUNT(*) as count 
      FROM User 
      WHERE createdAt >= ${thirtyDaysAgo}
      GROUP BY strftime('%Y-%m-%d', createdAt)
      ORDER BY date ASC
    `;
    
    return NextResponse.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      usersByRole,
      recentRegistrations: recentRegistrations.map(item => ({
        date: item.date,
        count: Number(item.count)
      }))
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
