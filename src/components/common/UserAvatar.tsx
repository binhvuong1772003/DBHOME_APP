import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface StaffAvatarProps {
  initials: string;
  avatarUrl?: string | null;
  alt?: string;
  className?: string;
}

export function StaffAvatar({
  initials,
  avatarUrl,
  alt = "Staff avatar",
  className = "",
}: StaffAvatarProps) {
  return (
    <Avatar className={`ring-2 ring-background ${className}`}>
      {avatarUrl && (
        <AvatarImage src={avatarUrl} alt={alt} className="object-cover" />
      )}

      <AvatarFallback className="bg-brand-light font-semibold text-brand-dark">
        {initials}
      </AvatarFallback>

      <AvatarBadge className="bg-secondary" />
    </Avatar>
  );
}
