import { Button, DefaultMantineColor, Variants } from "@mantine/core";
import { PropsWithChildren } from "react";

interface Props {
  onClick?: () => any;
  color?: DefaultMantineColor;
  variant?: Variants<
    "gradient" | "filled" | "outline" | "light" | "white" | "default" | "subtle"
  >;
  leftIcon?: React.ReactNode;
}

function ButtonWithIcon({
  variant = "filled",
  color = "dark",
  ...props
}: PropsWithChildren<Props>) {
  const hasText = props.children !== undefined;
  const hasIcon = props.leftIcon !== undefined;

  return (
    <Button
      onClick={props.onClick}
      radius="xl"
      variant={variant}
      color={color}
      leftIcon={hasIcon && !hasText ? undefined : props.leftIcon}
    >
      {hasText ? props.children : props.leftIcon}
    </Button>
  );
}

export default ButtonWithIcon;
