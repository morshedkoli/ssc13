import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalizePhone(input: string): string {
  let digits = input.trim().replace(/[\s\-().]/g, "");
  const hasPlus = digits.startsWith("+");
  if (hasPlus) digits = digits.slice(1);
  digits = digits.replace(/\D/g, "");
  if (hasPlus) return "+" + digits;
  if (digits.startsWith("8801") && digits.length === 13) return "+" + digits;
  if (digits.startsWith("01") && digits.length === 11) return "+88" + digits;
  return "+" + digits;
}

const members = [
  { name: "Murshed Al Main", phone: "01710000001", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/murshed1" },
  { name: "Delowar Hossain", phone: "01710000002", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/delowar2" },
  { name: "Monna Moyshan Hridoy", phone: "01710000003", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/hridoy3" },
  { name: "Emran Hossain Himu", phone: "01710000004", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/himu4" },
  { name: "Mostafizul Islam", phone: "01710000005", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/mostafiz5" },
  { name: "Shariful Islam", phone: "01710000006", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/sharif6" },
  { name: "Sheikh Mosharaf", phone: "01710000007", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/mosharaf7" },
  { name: "Md Shibbir Ahmed", phone: "01710000008", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/shibbir8" },
  { name: "Abu Hasnat", phone: "01710000009", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/hasnat9" },
  { name: "Dider Hossain Palash", phone: "01710000010", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/palash10" },
  { name: "Tayef Sarail", phone: "01710000011", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/tayef11" },
  { name: "Al Amin Hoossain Talqder", phone: "01710000012", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/alamin12" },
  { name: "Abdullah Al Rajib", phone: "01710000013", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/rajib13" },
  { name: "Mohammad Shohag", phone: "01710000014", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/shohag14" },
  { name: "Md Al Amin Ahmed", phone: "01710000015", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/alamin15" },
  { name: "Himel Duronti", phone: "01710000016", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/himel16" },
  { name: "Mahbub Rusmot", phone: "01710000017", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/mahbub17" },
  { name: "Joy Ghosh", phone: "01710000018", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/joy18" },
  { name: "Tushar Debnath", phone: "01710000019", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/tushar19" },
  { name: "Rubelur Rahman", phone: "01710000020", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/rubel20" },
  { name: "Ashraful Islam", phone: "01710000021", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/ashraful21" },
  { name: "MD Alamin Khan SB", phone: "01710000022", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/alamin22" },
  { name: "MH Nazmul Hasan", phone: "01710000023", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/nazmul23" },
  { name: "Md Sajid Amin", phone: "01710000024", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/sajid24" },
  { name: "Nayem (Rongbaj Chele)", phone: "01710000025", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/nayem25" },
  { name: "AR Habib", phone: "01710000026", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/habib26" },
  { name: "Mizanul Haque Nadim", phone: "01710000027", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/nadim27" },
  { name: "Sheikh Nuhash", phone: "01710000028", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/nuhash28" },
  { name: "Nahid", phone: "01710000029", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/nahid29" },
  { name: "Somon", phone: "01710000030", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/somon30" },
  { name: "Imran Hossain", phone: "01710000031", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/imran31" },
  { name: "Touhid Lasker Hridoy", phone: "01710000032", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/touhid32" },
  { name: "Rabbi", phone: "01710000033", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/rabbi33" },
  { name: "Rajon", phone: "01710000034", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/rajon34" },
  { name: "Mizanur Rahman", phone: "01710000035", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/mizan35" },
  { name: "Nasim", phone: "01710000036", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/nasim36" },
  { name: "Monir Khan", phone: "01710000037", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/monir37" },
  { name: "Shah Newaj", phone: "01710000038", address: "Kalikaccha, Sarail", facebook: "https://facebook.com/shah38" },
];

async function main() {
  let created = 0;
  let skipped = 0;

  for (const m of members) {
    const phoneNormalized = normalizePhone(m.phone);
    const existing = await prisma.member.findUnique({ where: { phoneNormalized } });
    if (existing) {
      console.log(`  SKIP: ${m.name} (${m.phone}) — already exists`);
      skipped++;
      continue;
    }
    await prisma.member.create({
      data: {
        name: m.name,
        phoneRaw: m.phone,
        phoneNormalized,
        address: m.address,
        facebook: m.facebook,
        status: "APPROVED",
      },
    });
    console.log(`  OK: ${m.name} (${m.phone})`);
    created++;
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
