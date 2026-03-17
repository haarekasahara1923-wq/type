import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Finding students with null contact...')
  const students = await prisma.student.findMany({
    where: {
      OR: [
        { contact: null },
        { contact: '' }
      ]
    }
  })

  console.log(`Found ${students.length} students to update.`)

  for (const student of students) {
    const dummyContact = `legacy-${student.id.slice(-5)}`;
    await prisma.student.update({
      where: { id: student.id },
      data: { contact: dummyContact }
    })
    console.log(`Updated student ${student.name} with contact ${dummyContact}`)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
