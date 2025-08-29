import React from "react";
import randomColor from "randomcolor";

export default function Avatar({ name, firstName, lastName, imageUrl, size = 30 }) {
  // Determine the display name
  let displayName = "";
  if (name) {
    displayName = name.trim();
  } else {
    displayName = `${firstName || ""} ${lastName || ""}`.trim();
  }

  // Extract initials
  let initials = "";
  if (displayName) {
    const parts = displayName.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      initials =
        (parts[0][0] || "").toUpperCase() + (parts[1][0] || "").toUpperCase();
    } else {
      initials = (parts[0][0] || "").toUpperCase();
    }
  }

  // Generate a consistent random background color
  const bgColor = randomColor({
    seed: displayName, // ensures same color for same name
    luminosity: "dark", // keep good contrast for white text
  });

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={displayName}
        className="rounded-circle object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
      style={{
        backgroundColor: bgColor,
        width: size,
        height: size,
        fontSize: size / 2.5,
      }}
    >
      {initials}
    </div>
  );
}

// ✅ Example usage
// <Avatar name="Pavan Kurme" size={60} />
// <Avatar firstName="Pavan" lastName="Kurme" imageUrl={null} size={60} />
