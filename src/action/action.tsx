import { Key, ActionEvent, Action as PhocusAction } from "phocus";
import { componentForElement } from "../utils";
import { PhocusContext } from "../phocus-context/phocus-context";

export class Action extends PhocusAction {
  unwrappedActOn: (
    argument: any,
    element?: HTMLElement,
    e?: ActionEvent,
  ) => void;

  constructor(description: {
    name: string;
    shortDocumentation?: string;
    searchTerms?: string[];
    actOn: (argument: any, element?: HTMLElement, e?: ActionEvent) => void;
    defaultKeys: Key[];
    hidden?: boolean;
  }) {
    const {actOn, ...desc} = description;
    const wrappedActOn = (_: any, element: HTMLElement, event?: ActionEvent) => {
      const component: PhocusContext = componentForElement(element);
      this.unwrappedActOn(component.props.argument, element, event);
    };
    super({...desc, actOn: wrappedActOn});
    this.unwrappedActOn = actOn;

  }
}
