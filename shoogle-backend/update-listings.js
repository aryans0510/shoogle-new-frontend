const { PrismaClient } = require('@prisma/client');

async function updateListings() {
  const prisma = new PrismaClient();
  
  try {
    const result = await prisma.listing.updateMany({
      where: {
        visible_in_discovery: false
      },
      data: {
        visible_in_discovery: true
      }
    });
    console.log('Updated', result.count, 'listings to be visible in discovery');
  } catch (error) {
    console.error('Error updating listings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateListings();