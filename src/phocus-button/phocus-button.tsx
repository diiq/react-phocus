import * as React from "react";

export interface PhocusButtonProps {
  action: string;
  className?: string;
  style?: React.CSSProperties;
  autofocus?: boolean;
  disabled?: boolean;
  phocusId?: string;
  doNotLabel?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-haspopup"?: boolean;
  role?: string;
  children?: React.ReactNode | React.ReactChildren;
}

export function PhocusButton(props: PhocusButtonProps) {
  let { action, children, doNotLabel, phocusId, ...bprops } = props;
  return (
    <button
      data-phocus-action={action}
      data-phocus-id={phocusId}
      data-phocus-do-not-label={doNotLabel}
      {...bprops}
    >
      {children}
    </button>
  );
}
