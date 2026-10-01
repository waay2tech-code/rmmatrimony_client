import React, { useEffect, useState } from "react";

/**
 * How long a freshly registered profile keeps its "NEW" badge.
 */
export const NEW_PROFILE_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

const toTimestamp = (value) => {
  if (!value) return null;
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? null : t;
};

/**
 * Returns true while `createdAt` is inside the 24-hour window.
 *
 * The timer is armed for the exact remaining time, so the badge switches
 * itself off the moment the window closes - no page reload, no parent
 * re-render, and no badge left behind on a long-lived tab.
 */
export const useIsNewProfile = (createdAt) => {
  const createdTs = toTimestamp(createdAt);
  const [isNew, setIsNew] = useState(
    () => createdTs !== null && Date.now() - createdTs < NEW_PROFILE_WINDOW_MS
  );

  useEffect(() => {
    if (createdTs === null) {
      setIsNew(false);
      return;
    }

    const remaining = createdTs + NEW_PROFILE_WINDOW_MS - Date.now();

    if (remaining <= 0) {
      // Already older than 24 hours (e.g. page left open across the boundary).
      setIsNew(false);
      return;
    }

    setIsNew(true);
    const timer = setTimeout(() => setIsNew(false), remaining);
    return () => clearTimeout(timer);
  }, [createdTs]);

  return isNew;
};

/**
 * "NEW" badge for profiles registered within the last 24 hours.
 * Renders nothing for older profiles, so it can be dropped into any card
 * without conditionals at the call site.
 */
const NewBadge = ({ createdAt, className = "" }) => {
  const isNew = useIsNewProfile(createdAt);

  if (!isNew) return null;

  const hoursLeft = Math.max(
    1,
    Math.ceil(
      (toTimestamp(createdAt) + NEW_PROFILE_WINDOW_MS - Date.now()) / 3600000
    )
  );

  return (
    <span
      title={`New member - badge hides ${hoursLeft}h after registration`}
      data-testid="new-profile-badge"
      className={`inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 shadow-md ring-1 ring-emerald-300 ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white"></span>
      </span>
      NEW
    </span>
  );
};

export default NewBadge;