import * as React from "react";

export interface PhocusButtonProps {
  context: string;
  argument: any;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  role?: string;
  tag?: string;
  tabIndex?: number;
}

export class PhocusContext extends React.Component<PhocusButtonProps, {}> {
  static defaultProps = {
    tag: "div"
  };

  render() {
    let { tag, context, argument, ...bprops } = this.props;
    return React.createElement(this.props.tag as string, {
      "data-phocus-context-name": context,
      ...bprops
    });
  }
}
