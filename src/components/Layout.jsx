/**
 * components/Layout.jsx
 *
 * The shell of your app — sidebar + topbar + the page content slot.
 * In React, layout components use a special prop called `children`
 * which represents "whatever you put between the opening and closing tags".
 *
 * Example:
 *   <Layout>
 *     <ClassesList />   ← this becomes `children`
 *   </Layout>
 */

import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

// Icons as simple SVG components — no icon library needed
function IconHome()        { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function IconBook()        { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; }
function IconBuilding()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x={2} y={7} width={20} height={14} rx={1}/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>; }
function IconUsers()       { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx={9} cy={7} r={4}/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function IconGrad()        { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>; }
function IconClipboard()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x={8} y={2} width={8} height={4} rx={1} ry={1}/></svg>; }
function IconMenu()        { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1={3} y1={12} x2={21} y2={12}/><line x1={3} y1={6} x2={21} y2={6}/><line x1={3} y1={18} x2={21} y2={18}/></svg>; }
function IconX()           { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/></svg>; }

const NAV_ITEMS = [
  { to: "/",            label: "Home",        icon: <IconHome /> },
  { to: "/subjects",   label: "Subjects",    icon: <IconBook /> },
  { to: "/departments",label: "Departments", icon: <IconBuilding /> },
  { to: "/faculty",    label: "Faculty",     icon: <IconUsers /> },
  { to: "/classes",    label: "Classes",     icon: <IconGrad /> },
  { to: "/enrollments/create", label: "Enrollments", icon: <IconClipboard /> },
];

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Build a simple breadcrumb from the current URL
  // "/classes/show/5" → ["Classes", "Show", "5"]
  const crumbs = location.pathname
    .split("/")
    .filter(Boolean)
    .map((segment, i, arr) => ({
      label: isNaN(segment) ? capitalize(segment) : `#${segment}`,
      path: "/" + arr.slice(0, i + 1).join("/"),
    }));

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <IconGrad />
          <span>EduSystem</span>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-section-label">Navigation</p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"} // "end" means only match exact path for home
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          EduSystem v1.0
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="main-content">
        <header className="topbar">
          {/* Mobile menu button */}
          <button
            className="btn btn-ghost btn-sm"
            style={{ display: "none" }} // shown via CSS media query
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <IconX /> : <IconMenu />}
          </button>

          {/* Breadcrumb */}
          <nav className="topbar-breadcrumb">
            <NavLink to="/">Home</NavLink>
            {crumbs.map((crumb, i) => (
              <React.Fragment key={crumb.path}>
                <span>/</span>
                {i === crumbs.length - 1 ? (
                  <span>{crumb.label}</span>
                ) : (
                  <NavLink to={crumb.path}>{crumb.label}</NavLink>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="topbar-right">
            <div className="topbar-user">
              <span>👤</span>
              <span>My Account</span>
            </div>
          </div>
        </header>

        {/* THIS is where your page components render */}
        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}