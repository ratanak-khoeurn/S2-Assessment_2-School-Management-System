import React from "react";

interface HeaderProps {
  onToggleSidebar: () => void;
  notificationCount?: number;
  userName?: string;
  userRole?: string;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  notificationCount = 3,
  userName = "Admin",
  userRole = "Administrator",
  onProfileClick,
  onNotificationClick,
}) => {
  return (
    <header
      style={{
        background: "#fff",
        padding: "0 24px",
        height: 60,
        display: "flex",
        alignItems: "center",
        gap: 16,
        borderBottom: "1px solid #e2e8f0",
        flexShrink: 0,
      }}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggleSidebar}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 20,
          color: "#64748b",
        }}
        aria-label="Toggle Navigation Sidebar"
      >
        ☰
      </button>

      {/* App Title */}
      <div style={{ flex: 1 }}>
        <span
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          School Management
        </span>

        <span
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#3b82f6",
            marginLeft: 5,
          }}
        >
          System
        </span>

        <div
          style={{
            fontSize: 10,
            color: "#94a3b8",
            marginTop: 1,
          }}
        >
          Administration Panel
        </div>
      </div>

      {/* Notification Icon */}
      <div
        onClick={onNotificationClick}
        style={{
          position: "relative",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 20 }}>🔔</span>

        {notificationCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "#ef4444",
              color: "#fff",
              fontSize: 9,
              borderRadius: 10,
              padding: "1px 4px",
              fontWeight: 700,
            }}
          >
            {notificationCount}
          </span>
        )}
      </div>

      {/* Admin Profile */}
      <div
        onClick={onProfileClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
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
          {userName.charAt(0).toUpperCase()}
        </div>

        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#1e293b",
            }}
          >
            {userName}
          </div>

          <div
            style={{
              fontSize: 11,
              color: "#94a3b8",
            }}
          >
            {userRole}
          </div>
        </div>

        <span
          style={{
            color: "#94a3b8",
            fontSize: 12,
          }}
        >
          ▾
        </span>
      </div>
    </header>
  );
};

export default Header;
