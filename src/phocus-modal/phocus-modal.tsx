import * as React from "react";
import * as ReactDOM from "react-dom";
import "./modal.css";
import { ActionContextService, ConstrainFocusService } from "phocus";
import { Action } from "../action/action";
import { PhocusContext } from "../phocus-context/phocus-context";
import { PhocusButton } from "../phocus-button/phocus-button";

ActionContextService.addContext("modal", {
  actions: {
    closeModal: new Action({
      name: "Close modal",
      shortDocumentation: "Closes the currently open modal",
      searchTerms: [],
      defaultKeys: ["Escape"],
      actOn: (component: PhocusModal) => {
        component.props.close();
      }
    })
  }
});

export interface PhocusButtonProps {
  close: () => void;
}

export class PhocusModal extends React.Component<PhocusButtonProps> {
  el: HTMLDivElement;
  constructor(props: PhocusButtonProps) {
    super(props);
    this.el = document.createElement("div");
    document.body.appendChild(this.el);
  }

  componentDidMount() {
    ConstrainFocusService.pushConstraint(() => this.el);
    Array.from(document.body.children).forEach(e => {
      if (e === this.el) return;
      if (e.getAttribute("aria-hidden"))
        (e as any).phocusOldAriaHidden = e.getAttribute("aria-hidden");
      e.setAttribute("aria-hidden", "true");
    });
  }

  componentWillUnmount() {
    Array.from(document.body.children).forEach(e => {
      e.setAttribute(
        "aria-hidden",
        (e as HTMLElement).dataset.phocusOldAriaHidden || "false"
      );
    });
    ConstrainFocusService.popConstraint();
  }

  render() {
    return ReactDOM.createPortal(
      <PhocusContext
        context="modal"
        argument={this}
        className="modal-container"
      >
        {this.props.children}
        <PhocusButton action="closeModal" className="modal-background">
          <span />
        </PhocusButton>
      </PhocusContext>,
      this.el
    );
  }
}
