import {
  PrismaClient,
  VariantBudgetTier,
  VariantMode,
  VariantSpace,
  TimeTier,
  Seasonality,
  RiskLevel,
  VariantStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

function pad3(n: number) {
  return n.toString().padStart(3, '0');
}
function pick<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

async function main() {
  const libraryVersion = '0.1.0';

  // 1) Hobby 40개 upsert
  for (let i = 1; i <= 40; i++) {
    const n = pad3(i);
    await prisma.hobby.upsert({
      where: { hobbyKey: `h_${n}` },
      update: {
        nameKo: `취미 ${n}`,
        oneLiner: `취미 ${n} 한 줄 설명`,
        coreTags: ['루틴', '초보', '실행'],
        starterKit: ['메모앱'],
        contraindications: [],
      },
      create: {
        hobbyKey: `h_${n}`,
        nameKo: `취미 ${n}`,
        oneLiner: `취미 ${n} 한 줄 설명`,
        coreTags: ['루틴', '초보', '실행'],
        starterKit: ['메모앱'],
        contraindications: [],
      },
    });
  }

  const hobbies = await prisma.hobby.findMany({ orderBy: { hobbyKey: 'asc' } });

  // 2) Variant 120개(각 hobby당 3개) upsert
  const modes = [VariantMode.SOLO, VariantMode.GROUP, VariantMode.HYBRID];
  const spaces = [VariantSpace.INDOOR, VariantSpace.OUTDOOR, VariantSpace.MIXED];
  const budgets = [VariantBudgetTier.LOW, VariantBudgetTier.MID, VariantBudgetTier.HIGH];
  const times = [TimeTier.MICRO, TimeTier.SHORT, TimeTier.LONG];
  const seasons = [
    Seasonality.ALL,
    Seasonality.SPRING,
    Seasonality.SUMMER,
    Seasonality.FALL,
    Seasonality.WINTER,
  ];
  const risks = [RiskLevel.LOW, RiskLevel.MID, RiskLevel.HIGH];

  let v = 1;
  for (const hobby of hobbies) {
    for (let j = 0; j < 3; j++) {
      const vn = pad3(v++);
      const mode = pick(modes, v + j);
      const space = pick(spaces, v * 2 + j);
      const budgetTier = pick(budgets, v * 3 + j);
      const timeTier = pick(times, v * 4 + j);
      const seasonality = pick(seasons, v * 5 + j);
      const riskLevel = pick(risks, v * 6 + j);

      const weeklyPlan7d = Array.from({ length: 7 }).map(
        (_, d) => `Day${d + 1}: ${hobby.nameKo} 실행 + 1줄 기록`,
      );
      const plan30d = [
        '1주: 주 2회 실행',
        '2주: 난이도/시간 조절',
        '3주: 변형 확장',
        '4주: 월간 요약 공유',
      ];

      await prisma.variant.upsert({
        where: { variantKey: `v_${vn}` },
        update: {
          hobbyId: hobby.id,
          mode,
          space,
          budgetTier,
          timeTier,
          difficulty: Math.min(5, 1 + ((j + v) % 5)),
          seasonality,
          riskLevel,
          weeklyPlan7d,
          plan30d,
          shortCaption: `오늘은 ${hobby.nameKo}(${mode}/${space}) 10분만 해봤다.`,
          longCaption: `요약: ${hobby.nameKo} 시작\n느낀점: ...\n다음 목표: ...\n팁: ...`,
          hashtags: ['#취미', '#루틴', '#기록'],
          proofPrompt: '사진 1장 + 한 줄 기록',
          status: VariantStatus.ACTIVE,
          version: libraryVersion,
          lastUpdated: new Date(),
        },
        create: {
          variantKey: `v_${vn}`,
          hobbyId: hobby.id,
          mode,
          space,
          budgetTier,
          timeTier,
          difficulty: Math.min(5, 1 + ((j + v) % 5)),
          seasonality,
          riskLevel,
          weeklyPlan7d,
          plan30d,
          shortCaption: `오늘은 ${hobby.nameKo}(${mode}/${space}) 10분만 해봤다.`,
          longCaption: `요약: ${hobby.nameKo} 시작\n느낀점: ...\n다음 목표: ...\n팁: ...`,
          hashtags: ['#취미', '#루틴', '#기록'],
          proofPrompt: '사진 1장 + 한 줄 기록',
          status: VariantStatus.ACTIVE,
          version: libraryVersion,
          lastUpdated: new Date(),
        },
      });
    }
  }

  const hobbyCount = await prisma.hobby.count();
  const variantCount = await prisma.variant.count();

  console.log(`✅ Seed complete: Hobby=${hobbyCount}, Variant=${variantCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
