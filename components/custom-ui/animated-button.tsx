import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  href?: string;
  icon?: ReactNode;
  label: string | ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  isExternal?: boolean;
}

export function AnimatedButton({
  href,
  icon,
  label,
  className = "",
  onClick,
  disabled = false,
  isExternal = false,
}: AnimatedButtonProps) {
  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const commonProps = {
    className: `group flex h-11 items-center rounded-full px-6 transition-colors ${className}`,
    variants: buttonVariants,
    whileHover: "hover",
    whileTap: "tap",
  };

  const content = (
    <>
      {icon && (
        <span className="mr-2 h-5 w-5 transition-transform group-hover:scale-110">
          {icon}
        </span>
      )}
      <span className="text-sm font-medium">{label}</span>
    </>
  );

  // If it's a link
  if (href) {
    return (
      <motion.a
        href={href}
        {...(isExternal && {
          target: "_blank",
          rel: "noopener noreferrer",
        })}
        {...commonProps}
      >
        {content}
      </motion.a>
    );
  }

  // If it's a button
  return (
    <motion.button onClick={onClick} disabled={disabled} {...commonProps}>
      {content}
    </motion.button>
  );
}
