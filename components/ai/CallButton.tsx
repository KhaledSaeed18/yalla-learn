"use client"

import { Button } from "@/components/ui/button"

interface CallButtonProps {
  onClick: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  disabled?: boolean;
}

const CallButton = ({ onClick, isConnected, isConnecting, disabled }: CallButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isConnecting}
      variant={isConnected ? "destructive" : "default"}
      size="lg"
      className="px-8 font-medium text-lg"
    >
      {isConnecting ? "Connecting..." : isConnected ? "End Call" : "Start Call"}
    </Button>
  )
}

export default CallButton
