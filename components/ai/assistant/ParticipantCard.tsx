import Avatar from "./Avatar"
import StatusBadge from "./StatusBadge"

interface ParticipantCardProps {
  name: string;
  role: string;
  status: string;
  avatarSrc?: string;
  isActive: boolean;
}

const ParticipantCard = ({ name, role, status, avatarSrc, isActive }: ParticipantCardProps) => {
  return (
    <div className="bg-card rounded-xl p-8 flex flex-col items-center justify-center gap-4 w-full border border-primary/50">
      <Avatar src={avatarSrc} alt={name} name={name} />
      <div className="text-center">
        <h3 className="text-xl font-semibold text-primary mb-1">{name}</h3>
        <p className="text-muted-foreground mb-4">{role}</p>
        <StatusBadge status={status} isActive={isActive} />
      </div>
    </div>
  )
}

export default ParticipantCard
