import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../AuthContext";

export default function FriendsModal({ onClose }) {
  const modalRef = useRef(null);
  const [username, setUsername] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const addFriend = async () => {
    console.log("Attempting to add friend with username:", username);
    if (!username.trim()) {
      console.log("Username is empty");
      return;
    }
    if (!user) {
      console.log("User not authenticated");
      return;
    }

    // Find user by username
    const { data: friendProfile, error: findError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username.trim())
      .single();

    if (findError || !friendProfile) {
      console.log("Error finding user or user not found:", findError);
      return;
    }

    console.log("Found friend profile:", friendProfile);

    // Insert friend request
    const { data, error } = await supabase
      .from('friends')
      .insert({
        user_id: user.id,
        friend_id: friendProfile.id,
        status: 'pending'
      });

    if (error) {
      console.log("Error inserting friend request:", error);
    } else {
      console.log("Friend request sent successfully:", data);
      setUsername("");
    }
  };

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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            marginTop: 10,
            padding: 8,
            borderRadius: 6
          }}
        />

        <button onClick={addFriend} style={{ marginTop: 10 }}>Добавить</button>
      </div>
    </div>,
    document.body
  );
}