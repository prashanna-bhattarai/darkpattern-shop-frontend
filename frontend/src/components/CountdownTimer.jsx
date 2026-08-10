import { useEffect, useState } from "react";

const format = (ms) => {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const CountdownTimer = ({ targetDate, className = "" }) => {
  const [remaining, setRemaining] = useState(() => new Date(targetDate) - new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(new Date(targetDate) - new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <span className={`countdown-num font-bold ${className}`}>
      Ends in {format(remaining)}
    </span>
  );
};

export default CountdownTimer;
