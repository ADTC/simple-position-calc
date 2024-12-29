import styles from "./styles.module.css";
import cn from "classnames";

export default function IconSpan({
  icon,
  title,
  hover, // means the parent is hovered
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  hover: boolean;
  onClick: () => void;
}) {
  return (
    <span
      title={title}
      onClick={onClick}
      className={cn(styles.iconSpan, hover && styles.hover)}
    >
      {icon}
    </span>
  );
}
