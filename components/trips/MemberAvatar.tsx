type MemberAvatarProps = {
  initials: string;
  tone?: "coral" | "pine" | "sand" | "blue";
  size?: "sm" | "md" | "lg";
};

const toneClasses = {
  coral: "bg-coral-soft text-[#9c503b]",
  pine: "bg-moss text-pine-dark",
  sand: "bg-sand text-[#8b6f43]",
  blue: "bg-blue-soft text-[#47727d]",
};

const sizeClasses = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
};

export function MemberAvatar({ initials, tone = "pine", size = "md" }: MemberAvatarProps) {
  return <span className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold ${toneClasses[tone]} ${sizeClasses[size]}`}>{initials}</span>;
}
