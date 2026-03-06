type RecItem = {
  rank: number;
  hobbyName: string;
  variantKey: string;
  mode: string;
  space: string;
  budgetTier: string;
  timeTier: string;
  difficulty: number;
  supplies: string[];
  explain: string;
  estCost: string;
  estTime: string;
  cta: { quickTask: string };
};

export default async function Page() {
  // 서버 컴포넌트에서 내부 API 호출
  const res = await fetch('http://localhost:3000/api/recommendations', {
    cache: 'no-store',
  });
  const data = (await res.json()) as { items: RecItem[] };

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <header style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>추천 취미 3개</h1>
        <p style={{ opacity: 0.75 }}>
          현재는 DB의 ACTIVE Variant 중 3개를 뽑아 보여줘요. (다음 단계에서 온보딩 입력 기반으로
          점수화)
        </p>
      </header>

      <div style={{ display: 'grid', gap: 12 }}>
        {data.items?.map((it) => (
          <section
            key={it.variantKey}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 14,
              padding: 16,
              background: 'white',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, opacity: 0.7 }}>#{it.rank}</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>{it.hobbyName}</div>
                <div style={{ marginTop: 8, fontSize: 14, opacity: 0.9 }}>{it.explain}</div>

                <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={pillStyle}>{it.mode}</span>
                  <span style={pillStyle}>{it.space}</span>
                  <span style={pillStyle}>비용: {it.estCost}</span>
                  <span style={pillStyle}>시간: {it.estTime}</span>
                  <span style={pillStyle}>난이도: {it.difficulty}/5</span>
                </div>

                <div style={{ marginTop: 12, fontSize: 13 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>준비물</div>
                  <div style={{ opacity: 0.9 }}>
                    {it.supplies?.length ? it.supplies.join(', ') : '없음'}
                  </div>
                </div>
              </div>

              <div style={{ minWidth: 220 }}>
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '12px 12px',
                    borderRadius: 12,
                    border: '1px solid #111827',
                    background: '#111827',
                    color: 'white',
                    cursor: 'default',
                    fontWeight: 700,
                  }}
                  aria-disabled="true"
                >
                  오늘 할 일
                </button>

                <div
                  style={{
                    marginTop: 10,
                    padding: 12,
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>5~15분 추천</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>
                    {it.cta?.quickTask ?? '10분만 해보기'}
                  </div>
                </div>

                <a
                  href={`/hobby/${it.variantKey}`}
                  style={{
                    marginTop: 10,
                    display: 'block',
                    textAlign: 'center',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    background: 'white',
                    cursor: 'pointer',
                    fontWeight: 700,
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  상세 보기
                </a>
              </div>
            </div>
          </section>
        ))}

        {!data.items?.length && (
          <div style={{ padding: 16, border: '1px dashed #e5e7eb', borderRadius: 12 }}>
            데이터가 없습니다. seed가 제대로 되었는지 확인해 주세요.
          </div>
        )}
      </div>
    </main>
  );
}

const pillStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 999,
  padding: '5px 10px',
  fontSize: 12,
  background: '#f9fafb',
};
