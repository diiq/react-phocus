import * as React from "react";
import { ActionContextService } from "phocus";
import { Action } from "../action/action";
import { PhocusModal } from "../phocus-modal/phocus-modal";
import { CommandPalette } from "./command-palette";

ActionContextService.addContext("with-command-palette", {
  actions: {
    showPalette: new Action({
      name: "Command palette",
      defaultKeys: ["Control+Shift+P", "Shift+Meta+P", "Control+Shift+?"],
      actOn: component => {
        component.showPalette();
      }
    })
  }
});

export class WithCommandPalette extends React.Component {
  state = {
    paletteOpen: false
  };

  showPalette() {
    this.setState({ paletteOpen: true });
  }

  hidePalette = () => {
    this.setState({ paletteOpen: false });
  };

  componentDidMount() {
    ActionContextService.addDefaultContext("with-command-palette", this);
  }

  componentDidUnMount() {
    ActionContextService.removeDefaultContext("with-command-palette", this);
  }

  render() {
    return (
      <div className="phocus-with-command-palette">
        {this.props.children}
        {this.state.paletteOpen && (
          <PhocusModal close={this.hidePalette}>
            <CommandPalette />
          </PhocusModal>
        )}
      </div>
    );
  }
}
