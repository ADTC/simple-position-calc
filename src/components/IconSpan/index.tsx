import styles from "./styles.module.css";
import cn from "classnames";

export default function IconSpan({
  icon,
  hover, // means the parent is hovered
  onClick,
}: {
  icon: React.ReactNode;
  hover: boolean;
  onClick: () => void;
}) {
  return (
    <span
      onClick={onClick}
      className={cn(styles.iconSpan, hover && styles.hover)}
    >
      {icon}
    </span>
  );
}
