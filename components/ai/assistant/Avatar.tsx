interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  name?: string;
}

const Avatar = ({ src, alt, size = 120, name }: AvatarProps) => {
  const getInitials = () => {
    if (!name) return "";

    const nameParts = name.split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const bgColors = [
    "bg-blue-500", "bg-green-500", "bg-yellow-500",
    "bg-red-500", "bg-purple-500", "bg-pink-500"
  ];

  const getColorClass = () => {
    if (!name) return bgColors[0];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return bgColors[sum % bgColors.length];
  };

  return (
    <div className="relative rounded-full overflow-hidden" style={{ width: size, height: size }}>
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center text-white ${getColorClass()}`}
          style={{ fontSize: size * 0.4 }}
        >
          {getInitials()}
        </div>
      )}
    </div>
  )
}

export default Avatar
