import * as React from "react";
import { Hotkey, Action } from "phocus";

export interface KeyCommandProps {
  action: Action;
}
export class KeyCommand extends React.Component<KeyCommandProps> {
  keys() {
    return this.props.action.keys
      .filter(k => k !== "None")
      .map(k => Hotkey.displayKey(k));
  }

  render() {
    return (
      <span className="phocus-key-command">
        {this.keys().length === 0 && "unbound"}
        {this.keys().map((key, i) => {
          return (
            <span key={i}>
              {!!i && " or "}
              <span className="phocus-key-command--key">{key}</span>
            </span>
          );
        })}
      </span>
    );
  }
}
