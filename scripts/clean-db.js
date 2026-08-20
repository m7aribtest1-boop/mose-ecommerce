/**
 * clean-db.js — امسح كل البيانات المعاملاتية/الشخصية وجهّز المشروع للنقل.
 *
 * الاستعمال:
 *   1) محلياً (SQLite): بدّل provider فـ prisma/schema.prisma إلى sqlite ثم:
 *        $env:mosa_DATABASE_URL_UNPOOLED="file:./prisma/dev.db"
 *        node scripts/clean-db.js
 *        npm run seed          # إعادة بذر كتالوج تجريبي نظيف + كوبون
 *   2) الإنتاج (Neon): وجّه المتغير إلى رابط قاعدة الإنتاج ثم نفّذ نفس الأوامر.
 *
 * ملاحظة: بعد التنفيذ تُعاد تهيئة حساب الأدمن بكلمة مرور عشوائية جديدة تُطبع مرة واحدة.
 */
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning transactional & personal data...');

  await prisma.returnRequest.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.review.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.aggregatedStat.deleteMany();
  await prisma.adminAuditLog.deleteMany();
  await prisma.adminNotification.deleteMany();

  const newPassword = crypto.randomBytes(6).toString('base64url');
  const admin = await prisma.adminUser.findUnique({ where: { email: 'admin@mose.ma' } });
  if (admin) {
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: await bcrypt.hash(newPassword, 10), totpEnabled: false, totpSecret: null },
    });
  } else {
    await prisma.adminUser.create({
      data: { email: 'admin@mose.ma', name: 'مدير موسى', passwordHash: await bcrypt.hash(newPassword, 10) },
    });
  }

  console.log('');
  console.log('====================================================');
  console.log('  ✅ Admin reset:');
  console.log('     Email:    admin@mose.ma');
  console.log(`     Password: ${newPassword}  (save now — shown only once)`);
  console.log('     → Change it immediately from Admin → Settings.');
  console.log('====================================================');
  console.log('');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });