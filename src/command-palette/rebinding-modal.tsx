import * as React from "react";
import * as ReactDOM from "react-dom";
import { ActionContextService, Hotkey, Action as PhocusAction } from "phocus";
import { Action } from "../action/action";
import { PhocusContext } from "../phocus-context/phocus-context";
import { KeyCommand } from "./key-command";
import { PhocusButton } from "../phocus-button/phocus-button";

ActionContextService.addContext("keybinding-modal", {
  actions: {
    rebind: new Action({
      name: "Change Hotkey",
      shortDocumentation: "Rebind the hotkey for this action",
      searchTerms: ["remap", "rebind", "change", "hotkey"],
      actOn: c => c.startRemapping(),
      defaultKeys: ["c"]
    }),

    unmap: new Action({
      name: "Remove Hotkey",
      shortDocumentation: "No key will perform this action",
      searchTerms: ["remap", "rebind", "change", "hotkey"],
      actOn: c => {
        ActionContextService.unmapAction(c.props.action);
        ActionContextService.triggerAction("closeModal");
      },
      defaultKeys: ["r"]
    }),

    unremap: new Action({
      name: "Restore defaults",
      shortDocumentation: "Restore the default hotkeys for this action",
      searchTerms: ["remap", "rebind", "change", "hotkey", "defaults"],
      actOn: c => {
        ActionContextService.unremapAction(c.props.action);
        ActionContextService.triggerAction("closeModal");
      },
      defaultKeys: ["d"]
    })
  }
});

export interface RebindingModalProps {
  action: PhocusAction;
}

export class RebindingModal extends React.Component<RebindingModalProps> {
  state = {
    remapping: false
  };

  startRemapping() {
    this.setState({ remapping: true });
  }

  componentDidMount() {
    ActionContextService.setContext(ReactDOM.findDOMNode(this) as HTMLElement);
  }

  remap = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const newMapping = Hotkey.canonicalKeyFromEvent(e.nativeEvent);
    if (!newMapping) return;

    ActionContextService.remapAction(this.props.action, newMapping);

    e.stopPropagation();
    e.preventDefault();
    this.setState({ remapping: false });
    ActionContextService.triggerAction("closeModal");
  };

  render() {
    return (
      <PhocusContext
        context="keybinding-modal"
        argument={this}
        className="phocus-keybinding-modal"
      >
        <div className="phocus-keybinding-modal--binding">
          <strong>{this.props.action.name}</strong>:
          {!this.state.remapping && <KeyCommand action={this.props.action} />}
          {this.state.remapping && <input onKeyDown={this.remap} autoFocus />}
        </div>
        <div className="phocus-keybinding-modal--actions">
          <PhocusButton action="rebind" />
          <PhocusButton action="unmap" />
          <PhocusButton action="unremap" />
        </div>
      </PhocusContext>
    );
  }
}
