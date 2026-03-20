// Format a date string into a readable label like "Today", "Yesterday", or "Mar 15"
export const formatDate = (dateStr) => {
  const date  = new Date(dateStr);
  const today = new Date();
  const diff  = Math.floor((today - date) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Truncate long text with ellipsis
export const truncate = (str, max = 40) =>
  str.length > max ? str.slice(0, max) + "…" : str;

// Get user initials from name (e.g. "John Doe" → "JD")
export const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);