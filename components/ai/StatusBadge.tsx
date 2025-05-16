interface StatusBadgeProps {
  status: string;
  isActive: boolean;
}

const StatusBadge = ({ status, isActive }: StatusBadgeProps) => {
  return (
    <div className={`px-4 py-1 rounded-full flex items-center gap-4 ${isActive ? "bg-primary" : "bg-muted-foreground"}`}>
      <div className={`w-2 h-2 rounded-full ${isActive ? "bg-muted-foreground" : "bg-primary"}`} />
      <span className="text-sm dark:text-black text-white">{status}</span>
    </div>
  )
}

export default StatusBadge
