# Phocus: focus and action management, with context-sensitive hotkeys

This is a react wrapper for the [Phocus](https://github.com/diiq/phocus) library.

Phocus helps you make your apps accessible and power-user-friendly by managing context-sensitive actions. Hotkeys and buttons are tied to the same root action definition, so they're guaranteed to do the same thing.

Phocus lets your users set, change, and unset keyboard shortcuts for all manner of actions in your app, and those shortcuts can be context-dependent, based on what object has focus.

## Example usage

See [React-Phocus Example](https://diiq.github.io/react-phocus-example/) for an absolutely stripped-down example of phocus making a todo.

See [Vistimo](https://www.vistimo.com) for a rich and complicated use-case.

## Installing

`yarn add react-phocus` or `npm install react-phocus`.

Phocus comes with typescript typings; no need to install them separately.

## Usage

Usage is much the same as Phocus.

### `ActionContextSevice` and `Action`

An action context is a set of actions which are available only when focus is within a specific part of the page. A context consists of a globally unique name, help text, and a list of actions. Each action has a name, help text, default hot keys, and an implementation.

```
import {
  Action,
  ActionContextService,
} from "phocus";

// Wherever you like, but ideally on startup, define some contexts:
ActionContextService.addContext("feature-thumbnail", {
  name: "The Feature Thumbnail",
  documentation: <ThumbnailDocs />,
  hidden: false,
  actions: {
    showBugs: new Action({
      name: "Show bugs",
      shortDocumentation: "Show a list of bugs filed against this feature",
      searchTerms: [],
      actOn: (id) => {
        let feature = getFeature(id);
        feature.showBugs();
      },
      defaultKeys: ["b"]
    }),
    showEnhancements: new Action({
      name: "Show enhancements",
      shortDocumentation: "Show a list of enhancements planned for this feature",
      searchTerms: [],
      actOn: (id) => {
        let feature = getFeature(id);
        feature.showEnhancements();
      },
      defaultKeys: ["h"]
    }),
    edit: new Action({
      name: "Edit",
      shortDocumentation: "Edit the feature's name or other properties without leaving the feature map.",
      searchTerms: ["edit"],
      actOn: (id, element, event) => {
        // You also get a reference to the context element,
        // and to the triggering event.
        activeEditor(element);
      },
      defaultKeys: ["e"]
    })
  }
});
```

### PhocusContext and PhocusButton

Rather than using the `data-phocus-` attributes to connect contexts and actions to the DOM, use these two react components:

```
<PhocusContext context="feature-thumbnail" argument={123}>
  <PhocusButton action="showBugs" />
  <div>
    <PhocusButton action="showEnhancements" />
    <PhocusButton action="edit"><i class="pencil-icon" /></PhocusButton>
  </div>
</div>
```

### Start your engines

Finally, use `startPhocus` to get things started.

```
import { startPhocus } from "phocus";

// Starting Phocus before your initial page load can slow down
// load times. It's recommended to wait until the initial
// render, and then call
startPhocus(document.body);
```

Contexts can be nested, and are transparent; if a child context does not shadow a parent's hotkey, then that hotkey will work even when the child is focused. A context marked `opaque: true` will shadow all actions in its parent.

`PhocusButton`s will be giving appropriate aria-labels, and if they contain no children, will be filled in with the actions 'name'.


### Constraining Focus

For modals and the like, it can be important to constrain focus, and prevent it from tabbing onto hidden elements.

```
ConstrainFocusService.pushConstraint(() => element);
```

Takes a function that returns an element (useful if the element in question hasn't been rendered, or changes over time), and will constrain focus to within that element until such time as you call

```
ConstrainFocusService.popConstraint();
```

As the names suggest, there is a stack of constraints; you can push consecutive constraints, and pop them one by one.

### Hotkey remapping

Hotkey mapping works exactly as in Phocus.

`ActionContextService.currentRemapping` is a JSON object representing the current mapping of hotkeys to actions. If you store this for a user, either in localstorage or on a server, then on subsequent visits, you can use `ActionContextService.restoreRemapping(mapping)` which takes that JSON object and restores the mapping it represents.

`remapAction(action: Action, newMapping)` takes an Action object and a key string (such as "Control+a") and customizes that action with that hotkey.

`unmapAction(action: Action)` removes hotkeys from an Action.

`unremapAction(action)` restores the default hotkeys to an Action.

All three remapping functions are temporary without using `currentRemapping` and `restoreRemapping` to carry the effects across sessions.

### Other useful functions

These all work exactly as in Phocus.

`stopPhocus(element)` removes all Phocus' event watchers from the dom.

`ActionContextService.availableActions` is the list of actions that could be taken in the currently focused context, and all its parents. This is useful for generating context-sensitive documentation.

`ActionContextService.contextStack` is the list of context-names, arguments, and DOM elements for the current context and all its ancestors.

`ActionContextService.contexts` is an object describing all context blueprints.

`ActionContextService.setContext(element)` will set the context to a given element. Using `document.activeElement` as an argument is the most common, setting the context to the currently focused element.

### Contributing

react-phocus is, first and foremost, a tool I use for building products myself. I probably won't accept changes that make it less effective for me, personally.

However, if you like react-phocus, and want to contribute, feel free to reach out, and I'll add you to the [Vistimo](https://www.vistimo.com) project that tracks Phocus' progress. 

Github issues are, if not welcome, accepted, and will be read eventually.