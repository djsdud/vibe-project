import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function HobbyDetailPage({
  params,
}: {
  params: { variantKey: string };
}) {
const variant = await prisma.variant.findFirst({
  where: { variantKey: params.variantKey },
  include: { hobby: true },
});

  if (!variant) return notFound();

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <a href="/" style={{ display: "inline-block", marginBottom: 16, opacity: 0.8 }}>
        ← 추천으로
      </a>

      <h1 style={{ fontSize: 28, fontWeight: 800 }}>{variant.hobby.nameKo}</h1>
      <p style={{ marginTop: 6, opacity: 0.85 }}>{variant.hobby.oneLiner}</p>

      <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span style={pill}>mode: {variant.mode}</span>
        <span style={pill}>space: {variant.space}</span>
        <span style={pill}>budget: {variant.budgetTier}</span>
        <span style={pill}>time: {variant.timeTier}</span>
        <span style={pill}>difficulty: {variant.difficulty}/5</span>
        <span style={pill}>risk: {variant.riskLevel}</span>
      </div>

      <section style={card}>
        <h2 style={h2}>준비물</h2>
        <div style={{ opacity: 0.9 }}>
          {variant.hobby.starterKit?.length ? variant.hobby.starterKit.join(", ") : "없음"}
        </div>
      </section>

      <section style={card}>
        <h2 style={h2}>7일 플랜</h2>
        <ol style={{ marginTop: 8, paddingLeft: 18 }}>
          {variant.weeklyPlan7d.map((t, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              {t}
            </li>
          ))}
        </ol>
      </section>

      <section style={card}>
        <h2 style={h2}>30일 플랜</h2>
        <ol style={{ marginTop: 8, paddingLeft: 18 }}>
          {variant.plan30d.map((t, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              {t}
            </li>
          ))}
        </ol>
      </section>

      <section style={card}>
        <h2 style={h2}>공유 템플릿</h2>

        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>짧은 캡션</div>
          <pre style={pre}>{variant.shortCaption}</pre>
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>긴 텍스트</div>
          <pre style={pre}>{variant.longCaption}</pre>
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>해시태그</div>
          <div style={{ opacity: 0.9 }}>{variant.hashtags.join(" ")}</div>
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>인증 가이드</div>
          <div style={{ opacity: 0.9 }}>{variant.proofPrompt}</div>
        </div>
      </section>
    </main>
  );
}

const pill: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 999,
  padding: "5px 10px",
  fontSize: 12,
  background: "#f9fafb",
};

const card: React.CSSProperties = {
  marginTop: 14,
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 16,
  background: "white",
};

const h2: React.CSSProperties = { fontSize: 16, fontWeight: 800 };

const pre: React.CSSProperties = {
  whiteSpace: "pre-wrap",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
};