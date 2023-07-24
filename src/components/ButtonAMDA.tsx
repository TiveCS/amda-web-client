import { Button, DefaultMantineColor, Variants } from "@mantine/core";
import { PropsWithChildren } from "react";

interface Props {
  onClick?: () => unknown;
  color?: DefaultMantineColor;
  variant?: Variants<
    "gradient" | "filled" | "outline" | "light" | "white" | "default" | "subtle"
  >;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
}

function ButtonWithIcon({
  variant = "filled",
  color = "dark",
  disabled = false,
  loading = false,
  className = "",
  type = "button",
  ...props
}: PropsWithChildren<Props>) {
  const hasText = props.children !== undefined;
  const hasIcon = props.leftIcon !== undefined;

  return (
    <Button
      className={className + " font-poppins"}
      onClick={props.onClick}
      radius="xl"
      loading={loading}
      variant={variant}
      color={color}
      leftIcon={hasIcon && !hasText ? undefined : props.leftIcon}
      disabled={disabled}
      type={type}
    >
      {hasText ? props.children : props.leftIcon}
    </Button>
  );
}

export default ButtonWithIcon;
