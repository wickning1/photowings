/* global CustomEvent */
export function a11yclick (node) {
  function keydown (e) {
    if (e.key === 'Enter' || e.key === 'Space') {
      if (!e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) node.dispatchEvent(new CustomEvent('click'))
    }
  }

  function click (e) {
    if (!(e instanceof CustomEvent)) node.dispatchEvent(new CustomEvent('click'))
  }

  node.addEventListener('click', click)
  node.addEventListener('keydown', keydown)

  return {
    destroy () {
      node.removeEventListener('click', click)
      node.removeEventListener('keydown', keydown)
    }
  }
}
