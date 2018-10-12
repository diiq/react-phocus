import * as React from "react";
import { ActionContextService, focusInContext } from "phocus";
import { Action } from "../action/action";
import { PhocusContext } from "../phocus-context/phocus-context";
import { ActionInContext } from "phocus/dist/action-context/action-context";
import { PhocusButton } from "../phocus-button/phocus-button";
import { PhocusModal } from "../phocus-modal/phocus-modal";
import { RebindingModal } from "./rebinding-modal";
import { KeyCommand } from "./key-command";

ActionContextService.addContext("command-palette-action", {
  actions: {
    doit: new Action({
      name: "Take this action",
      shortDocumentation: "Take the action",
      actOn: (c, _, e) => {
        ActionContextService.triggerAction("closeModal");
        c.props.action.act(e);
      },
      defaultKeys: ["Enter"]
    }),
    rebind: new Action({
      name: "Edit Hotkey",
      shortDocumentation: "Rebind or alter the hotkey for this action",
      actOn: (c, _, e) => {
        if (e) {
          e.stopPropagation();
          e.preventDefault();
        }
        c.editHotkey();
      },
      defaultKeys: ["e"]
    }),
    next: new Action({
      name: "Next",
      defaultKeys: ["ArrowDown"],
      actOn: c => {
        focusInContext(`action-${c.props.id + 1}`);
      }
    }),
    previous: new Action({
      name: "Previous",
      defaultKeys: ["ArrowUp"],
      actOn: c => {
        focusInContext(`action-${c.props.id - 1}`);
      }
    })
  }
});

export interface CommandPaletteActionProps {
  action: ActionInContext;
  id: string | number;
}

export class CommandPaletteAction extends React.Component<
  CommandPaletteActionProps
> {
  state = {
    hotkeyModalOpen: false
  };

  editHotkey() {
    this.setState({ hotkeyModalOpen: true });
  }

  cancelEdit = () => {
    this.setState({ hotkeyModalOpen: false });
  };

  render() {
    return (
      <PhocusContext context="command-palette-action" argument={this}>
        <div
          className="phocus-command-palette-action"
          data-phocus-id={`action-${this.props.id}`}
          data-phocus-on-mouseover
          data-phocus-do-not-label
          data-phocus-action="doit"
        >
          <div className="phocus-command-palette-action--name">{this.props.action.action.name}</div>
          <div className="phocus-command-palette-action--description">
            {this.props.action.action.shortDocumentation}
          </div>
          <PhocusButton
            action="rebind"
            className="phocus-command-palette-action--key-command"
            doNotLabel
          >
            <KeyCommand action={this.props.action.action} />
          </PhocusButton>
        </div>
        {this.state.hotkeyModalOpen && (
          <PhocusModal close={this.cancelEdit}>
            <RebindingModal action={this.props.action.action} />
          </PhocusModal>
        )}
      </PhocusContext>
    );
  }
}
