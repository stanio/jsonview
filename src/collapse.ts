/**
 * Add event handlers that allow for collapsing and expanding JSON structures, with the mouse or keyboard.
 */
export function installCollapseEventListeners() {
  // Click handler for collapsing and expanding objects and arrays
  function collapse(evt: Event) {
    let targetItem = evt.target as Element;
    function elementMatches(target: any, selector: string) {
      return typeof target.matches === "function" && target.matches(selector);
    }

    if (document.getSelection()?.type === "Range"
        && !elementMatches(targetItem, ".collapser")
        || elementMatches(targetItem, ":any-link")) {
      return;
    }

    while (targetItem && targetItem.localName !== "li") {
      targetItem = targetItem.parentElement as Element;
    }
    if (!targetItem) {
      return;
    }

    let collapsedAncestor = targetItem.parentElement?.closest(".collapsed");
    if (collapsedAncestor) {
      do {
        collapsedAncestor.classList.remove("collapsed");
        collapsedAncestor = collapsedAncestor.parentElement?.closest(".collapsed");
      } while (collapsedAncestor);
    } else if (targetItem.querySelector(":scope > .collapser")) {
      targetItem.classList.toggle("collapsed");
    }
  }

  /*
   * Collapses the whole json using keyboard
   * TODO: Add a navigator support for each of the elements
   */
  function collapseAll(evt: KeyboardEvent) {
    let inputList;
    let i;

    // Ignore anything paired with a modifier key. See https://github.com/bhollis/jsonview/issues/69
    if (evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey) {
      return;
    }

    if (evt.key === "ArrowLeft") {
      // Collapses the json on left arrow key up
      inputList = document.querySelectorAll(".collapser");
      for (i = 0; i < inputList.length; i++) {
        if ((inputList[i].parentNode! as HTMLElement).id !== "json") {
          inputList[i].parentElement?.classList.add("collapsed");
        }
      }
      evt.preventDefault();
    } else if (evt.key === "ArrowRight") {
      // Expands the json on right arrow key up
      inputList = document.querySelectorAll(".collapsed");
      for (i = 0; i < inputList.length; i++) {
        inputList[i].classList.remove("collapsed");
      }
      evt.preventDefault();
    }
  }

  // collapse with event delegation
  document.addEventListener("click", collapse, true);
  document.addEventListener("keyup", collapseAll, false);
}
