/* global CustomEvent */
export default function safemousein (node) {
  let isover = false
  function dispatch (enter) {
    if (enter && !isover) {
      node.dispatchEvent(new CustomEvent('in'))
      isover = true
    } else if (!enter && document.activeElement !== node) {
      node.dispatchEvent(new CustomEvent('out'))
      isover = false
    }
  }

  function mouseover (e) {
    dispatch(true)
  }

  function mouseout (e) {
    dispatch(false)
  }

  node.addEventListener('mouseenter', mouseover)
  node.addEventListener('mouseleave', mouseout)
  node.addEventListener('focusin', mouseover)
  node.addEventListener('focusout', mouseout)

  return {
    destroy () {
      node.removeEventListener('mouseenter', mouseover)
      node.removeEventListener('mouseleave', mouseout)
      node.removeEventListener('focusin', mouseover)
      node.removeEventListener('focusout', mouseout)
    }
  }
}
