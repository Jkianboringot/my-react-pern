/**
 * components/UI.jsx
 *
 * Reusable "dumb" components — they only render what you pass to them (props).
 * They don't fetch data or hold their own state (mostly).
 * This is exactly what React components are great at.
 */

import React from "react";

// ─── Button ──────────────────────────────────────────────────────────────────
/**
 * Props:
 *   variant  — "primary" | "outline" | "ghost" | "danger"   (default: "primary")
 *   size     — "sm" | "md" | "lg"                           (default: "md")
 *   full     — boolean, makes button full width
 *   loading  — shows a spinner and disables the button
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  full = false,
  loading = false,
  className = "",
  ...props
}) {
  const classes = [
    "btn",
    `btn-${variant}`,
    size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "",
    full ? "btn-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={loading || props.disabled} {...props}>
      {loading && <span className="spinner" style={{ width: 14, height: 14 }} />}
      {children}
    </button>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────
/**
 * Props:
 *   color — "green" | "gray" | "red" | "yellow" | "outline"  (default: "gray")
 */
export function Badge({ children, color = "gray", className = "" }) {
  return (
    <span className={`badge badge-${color} ${className}`}>{children}</span>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}
export function CardHeader({ children, className = "" }) {
  return <div className={`card-header ${className}`}>{children}</div>;
}
export function CardTitle({ children }) {
  return <h2 className="card-title">{children}</h2>;
}
export function CardContent({ children, className = "" }) {
  return <div className={`card-content ${className}`}>{children}</div>;
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
export function Avatar({ src, name = "", size = "md" }) {
  // Compute initials from name: "John Doe" → "JD"
  const initials = name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const sizeClass = size === "sm" ? "avatar-sm" : size === "lg" ? "avatar-lg" : "";

  return (
    <div className={`avatar ${sizeClass}`}>
      {src ? (
        <img src={src} alt={name} />
      ) : (
        <span>{initials || "?"}</span>
      )}
    </div>
  );
}

// ─── Spinner / Loading ───────────────────────────────────────────────────────
export function Spinner() {
  return <span className="spinner" />;
}

export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="state-box">
      <Spinner />
      <p>{message}</p>
    </div>
  );
}

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="state-box error">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx={12} cy={12} r={10} />
        <line x1={12} y1={8} x2={12} y2={12} />
        <line x1={12} y1={16} x2={12.01} y2={16} />
      </svg>
      <p>{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ message = "No records found." }) {
  return (
    <div className="state-box">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x={9} y={3} width={6} height={4} rx={1} />
      </svg>
      <p>{message}</p>
    </div>
  );
}

// ─── Separator ───────────────────────────────────────────────────────────────
export function Separator() {
  return <hr className="separator" />;
}

// ─── Form helpers ─────────────────────────────────────────────────────────────
export function FormGroup({ label, required, error, children, htmlFor }) {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={htmlFor}>
          {label}
          {required && <span className="required"> *</span>}
        </label>
      )}
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

// ─── Pagination ──────────────────────────────────────────────────────────────
export function Pagination({ page, pageSize = 10, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="pagination">
      <span>
        {total === 0 ? "No results" : `${from}–${to} of ${total}`}
      </span>
      <div className="pagination-controls">
        <button
          className="page-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          ←
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          // Show a window of pages around the current page
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce((acc, p, i, arr) => {
            if (i > 0 && arr[i - 1] !== p - 1) acc.push("...");
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} style={{ padding: "0 4px", color: "var(--text-muted)" }}>…</span>
            ) : (
              <button
                key={p}
                className={`page-btn ${p === page ? "active" : ""}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )
          )}
        <button
          className="page-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          →
        </button>
      </div>
    </div>
  );
}

// ─── Table ───────────────────────────────────────────────────────────────────
/**
 * A simple table component.
 *
 * Props:
 *   columns  — array of { key, label, render? }
 *              `render` is a function: (value, row) => ReactNode
 *   rows     — array of data objects
 */
export function Table({ columns, rows }) {
  if (rows.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key ?? col.label} style={col.width ? { width: col.width } : {}}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={row.id ?? rowIdx}>
              {columns.map((col) => (
                <td key={col.key ?? col.label}>
                  {col.render
                    ? col.render(col.key ? row[col.key] : undefined, row)
                    : col.key
                    ? String(row[col.key] ?? "")
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}