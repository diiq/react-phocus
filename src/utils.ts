// Many contexts will want to interact with the relevant react component. This
// will take a DOM element and return the React component that created it.

export function componentForElement(el: HTMLElement): any {
  for (const key in el) {
    if (key.startsWith('__reactInternalInstance$')) {
      const fiberNode = el[key];

      return fiberNode && fiberNode.return && fiberNode.return.stateNode;
    }
  }
  if (el.parentElement) {
    return componentForElement(el.parentElement);
  }
};