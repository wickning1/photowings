/* global CustomEvent */
export default function typing (node) {
  function keyup (e) {
    if (!e.metaKey && !e.ctrlKey && !e.altKey) node.dispatchEvent(new CustomEvent('typing'))
  }
  node.addEventListener('keyup', keyup)
  return {
    destroy () {
      node.removeEventListener('keyup', keyup)
    }
  }
}
