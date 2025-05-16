"use client"

import { Loader2 } from "lucide-react"

interface ButtonProps {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const Button = ({ label, onClick, isLoading, disabled }: ButtonProps) => {
  const opacity = disabled ? 0.75 : 1
  const cursor = disabled ? "not-allowed" : "pointer"

  const Contents = isLoading ? (
    <Loader2
      className="animate-spin"
      style={{ width: "20px", height: "20px", marginRight: "8px" }}
    />
  ) : (
    <p style={{ margin: 0, padding: 0 }}>{label}</p>
  )

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "white",
        color: "black",
        border: "2px solid #ddd",
        borderRadius: "8px",
        padding: "8px 20px",
        fontSize: "16px",
        outline: "none",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        opacity,
        cursor,
      }}
    >
      {Contents}
    </button>
  )
}

export default Button
