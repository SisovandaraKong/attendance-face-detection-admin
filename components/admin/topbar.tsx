type TopbarProps = {
  title: string;
  subtitle: string;
  userName?: string;
  role?: string;
};

export function Topbar({ title, subtitle, userName, role }: TopbarProps) {
  const time = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-side">
        {userName ? (
          <div className="topbar-user">
            <strong>{userName}</strong>
            <span>{role}</span>
          </div>
        ) : null}
        <div className="topbar-clock">{time}</div>
      </div>
    </header>
  );
}
