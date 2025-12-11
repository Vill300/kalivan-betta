import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function FriendsModal({ onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  return createPortal(
    <div
      className="settings-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="friends-modal"
        ref={modalRef}
        tabIndex={-1}
        style={{
          width: 400,
          background: "#111",
          padding: 20,
          borderRadius: 10,
          color: "#fff",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* КРЕСТИК — гарантированно работает */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 14,
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 22,
            cursor: "pointer"
          }}
        >
          ×
        </button>

        <h2>Друзья</h2>

        <label>Добавить друга</label>
        <input
          placeholder="Введите никнейм"
          style={{
            width: "100%",
            marginTop: 10,
            padding: 8,
            borderRadius: 6
          }}
        />

        <button style={{ marginTop: 10 }}>Добавить</button>
      </div>
    </div>,
    document.body
  );
}