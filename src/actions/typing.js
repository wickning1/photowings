/* global CustomEvent */
export default function typing (node) {
  let lastvalue = node.value
  function keyup (e) {
    if (node.value !== lastvalue) {
      node.dispatchEvent(new CustomEvent('typing'))
      lastvalue = node.value
    }
  }
  node.addEventListener('keyup', keyup)
  return {
    destroy () {
      node.removeEventListener('keyup', keyup)
    }
  }
}
