import React from "react";
import logoImg from "../../src/assets/up-image.png"; // Adjust path if needed

// 1. Define types for items and component props
export interface NavItem {
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  sidebarOpen: boolean;
  activeNav: string;
  handleNavigation: (label: string) => void;
  navItems: NavItem[];
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  activeNav,
  handleNavigation,
  navItems,
  onLogout,
}) => {
  return (
    <aside
      style={{
        width: sidebarOpen ? 240 : 0,
        minWidth: sidebarOpen ? 240 : 0,
        background: "linear-gradient(180deg, #0f2744 0%, #1a3a6b 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        transition: "width 0.25s, min-width 0.25s",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 18px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={logoImg}
              alt="School Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
              School Management
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.5)",
                marginTop: 2,
              }}
            >
              Administration Panel
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
            letterSpacing: 1,
            padding: "8px 18px",
          }}
        >
          Main Menu
        </div>

        {navItems.map((item) => {
          const isActive = activeNav === item.label;

          return (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.label)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                width: "100%",
                padding: "10px 18px",
                background: isActive ? "rgba(96,165,250,0.18)" : "transparent",
                borderTop: "none",
                borderRight: "none",
                borderBottom: "none",
                borderLeft: isActive
                  ? "3px solid #60a5fa"
                  : "3px solid transparent",
                color: isActive ? "#60a5fa" : "rgba(255,255,255,0.7)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                textAlign: "left",
                transition: "all 0.15s",
                borderRadius: isActive ? "0 6px 6px 0" : 0,
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  width: 20,
                  textAlign: "center",
                }}
              >
                {item.icon}
              </span>

              <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile / Logout */}
      <div
        style={{
          padding: "14px 18px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            A
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Admin</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
              Administrator
            </div>
          </div>
        </div>

        <button
          onClick={onLogout || (() => console.log("Logout"))}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            color: "rgba(255,255,255,0.6)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            padding: 0,
          }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;