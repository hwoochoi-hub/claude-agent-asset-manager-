"use client";

// 매우 단순한 마크다운 렌더러: Claude 응답(##, -, ---, 일반 문단)만 처리
export default function MarkdownLite({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  function flushList(key: string) {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul key={key} className="list-disc pl-5 space-y-1 my-2">
        {listBuffer.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      flushList(`list-${idx}`);
      blocks.push(
        <h3 key={idx} className="text-base font-semibold mt-4 first:mt-0">
          {trimmed.slice(3)}
        </h3>
      );
    } else if (trimmed.startsWith("- ")) {
      listBuffer.push(trimmed.slice(2));
    } else if (trimmed === "---") {
      flushList(`list-${idx}`);
      blocks.push(<hr key={idx} className="my-3" style={{ borderColor: "var(--gridline)" }} />);
    } else if (trimmed.length === 0) {
      flushList(`list-${idx}`);
    } else {
      flushList(`list-${idx}`);
      blocks.push(
        <p key={idx} className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {trimmed}
        </p>
      );
    }
  });
  flushList("list-end");

  return <div className="space-y-1">{blocks}</div>;
}
