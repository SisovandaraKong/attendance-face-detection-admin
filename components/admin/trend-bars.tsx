type TrendBarsProps = {
  title?: string;
  data: Array<{ label: string; value: number }>;
  tone?: "teal" | "amber" | "slate";
  emptyText?: string;
};

export function TrendBars({
  title,
  data,
  tone = "teal",
  emptyText = "No data available.",
}: TrendBarsProps) {
  const maxValue = Math.max(...data.map((entry) => entry.value), 1);

  return (
    <div>
      {title ? <div className="subpanel-title">{title}</div> : null}
      {data.length ? (
        <div className="trend-bars">
          {data.map((entry) => (
            <div key={entry.label} className="trend-col">
              <div className={`trend-fill ${tone}`} style={{ height: `${Math.max((entry.value / maxValue) * 130, entry.value ? 10 : 2)}px` }} />
              <strong>{entry.value}</strong>
              <span>{entry.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-copy">{emptyText}</p>
      )}
    </div>
  );
}
