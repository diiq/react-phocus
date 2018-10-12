import * as React from "react";
import * as ReactDOM from "react-dom";
import { ActionContextService } from "phocus";
import { Action } from "../action/action";
import { PhocusContext } from "../phocus-context/phocus-context";
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
    ActionContextService.setContext(ReactDOM.findDOMNode(this) as HTMLElement);
  }

  render() {
    return (
      <PhocusContext
        context="with-command-palette"
        argument={this}
        className="phocus-with-command-palette"
      >
        {this.props.children}
        {this.state.paletteOpen && (
          <PhocusModal close={this.hidePalette}>
            <CommandPalette />
          </PhocusModal>
        )}
      </PhocusContext>
    );
  }
}
