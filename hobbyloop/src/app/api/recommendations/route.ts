import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const variants = await prisma.variant.findMany({
    where: { status: 'ACTIVE' },
    include: { hobby: true },
    take: 50,
  });

  if (variants.length === 0) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  const items = variants
    .map((v) => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .slice(0, 3)
    .map(({ v }, idx) => ({
      rank: idx + 1,
      hobbyId: v.hobbyId,
      hobbyName: v.hobby.nameKo,
      variantId: v.id,
      variantKey: v.variantKey,
      mode: v.mode,
      space: v.space,
      budgetTier: v.budgetTier,
      timeTier: v.timeTier,
      difficulty: v.difficulty,
      supplies: v.hobby.starterKit.slice(0, 5),
      explain: `예산/시간 조건을 고려해 시작하기 쉬운 변형을 우선 추천했어요.`,
      estCost: v.budgetTier.toLowerCase(),
      estTime: v.timeTier.toLowerCase(),
      cta: {
        quickTask: v.weeklyPlan7d?.[0] ?? '오늘 10분만 해보기',
      },
    }));

  return NextResponse.json({ items }, { status: 200 });
}
