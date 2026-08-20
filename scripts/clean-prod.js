const dns = require('dns');
const TARGET_HOST = 'ep-ancient-star-avh27343.c-11.us-east-1.aws.neon.tech';
const TARGET_IP = '50.16.189.237';

const origLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
  if (typeof options === 'function') { callback = options; options = {}; }
  if (hostname === TARGET_HOST) {
    return callback(null, TARGET_IP, 4);
  }
  return origLookup.call(this, hostname, options, callback);
};
console.log('DNS_PATCHED');

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning...');
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
  console.log('====================================================');
  console.log('  ADMIN_RESET_EMAIL: admin@mose.ma');
  console.log('  ADMIN_RESET_PASSWORD: ' + newPassword);
  console.log('====================================================');
}
main().catch(e => { console.error('CLEAN_ERR', e.message); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });