import * as React from "react";
import { ActionContextService, focusInContext } from "phocus";
import { Action } from "../action/action";
import { ActionInContext } from "phocus/dist/action-context/action-context";
import { PhocusContext } from "../phocus-context/phocus-context";
import { filterActions } from "./action-search";
import { CommandPaletteAction } from "./command-palette-action";

ActionContextService.addContext("command-palette", {
  actions: {
    doit: new Action({
      name: "Take the first action",
      defaultKeys: ["Enter"],
      actOn: (component: CommandPalette) => {
        ActionContextService.triggerAction("closeModal");
        component.search()[0].act();
      }
    }),
    focusFirst: new Action({
      hidden: true,
      name: "Focus on the first action",
      defaultKeys: ["ArrowDown"],
      actOn: component => {
        focusInContext("action-0");
      }
    })
  }
});

export class CommandPalette extends React.Component {
  state = {
    search: "",
    actions: [] as ActionInContext[]
  };

  componentWillMount() {
    this.setState({ actions: ActionContextService.availableActions });
  }

  search() {
    return filterActions(this.state.actions, this.state.search);
  }

  render() {
    return (
      <PhocusContext
        context="command-palette"
        argument={this}
        className="phocus-command-palette"
      >
        <div className="phocus-command-palette--hint">Hint: try opening this command palette while different things are focused.</div>
        <input
          onChange={e => this.setState({ search: e.target.value })}
          value={this.state.search}
        />
        {this.search().map((a, i) => (
          <CommandPaletteAction action={a} key={i} id={i} />
        ))}
      </PhocusContext>
    );
  }
}
