import * as React from "react";

export interface PhocusButtonProps {
  action: string;
  className?: string;
  style?: React.CSSProperties;
  autofocus?: boolean;
  disabled?: boolean;
  phocusId?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-haspopup"?: boolean;
  role?: string;
  children?: React.ReactChildren;
}

export function PhocusButton(props: PhocusButtonProps) {
  let { action, children, phocusId, ...bprops } = props;
  return (
    <button data-phocus-action={action} data-phocus-id={phocusId} {...bprops}>
      {children}
    </button>
  );
}
