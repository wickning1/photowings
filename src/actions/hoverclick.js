/* global CustomEvent, requestAnimationFrame, cancelAnimationFrame */
export default function hoverclick (node) {
  let hovering = false
  let timer
  let touch = false

  function fireIn (e) {
    if (e.type !== 'click' && touch) return
    cancelAnimationFrame(timer)
    timer = requestAnimationFrame(() => {
      if (!hovering) {
        hovering = true
        touch = false
        node.dispatchEvent(new CustomEvent('in', e))
      }
    })
  }

  function fireOut (e) {
    cancelAnimationFrame(timer)
    timer = requestAnimationFrame(() => {
      if (hovering) {
        hovering = false
        node.dispatchEvent(new CustomEvent('out', e))
      }
    })
  }

  function activate (e) {
    cancelAnimationFrame(timer)
    timer = requestAnimationFrame(() => {
      if (hovering) node.dispatchEvent(new CustomEvent('activate', e))
      else fireIn(e)
    })
  }

  function keydown (e) {
    if (e.key === 'Enter' || e.key === 'Space') {
      if (!e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) activate(e)
    }
  }

  function touchstart (e) {
    touch = true
  }

  node.addEventListener('mousemove', fireIn)
  node.addEventListener('mouseleave', fireOut)
  node.addEventListener('touchstart', touchstart)
  node.addEventListener('focusin', fireIn)
  node.addEventListener('focusout', fireOut)
  node.addEventListener('click', activate)
  node.addEventListener('keydown', keydown)

  return {
    destroy () {
      node.removeEventListener('mousemove', fireIn)
      node.removeEventListener('mouseleave', fireOut)
      node.removeEventListener('focusin', fireIn)
      node.removeEventListener('focusout', fireOut)
      node.removeEventListener('mousedown', activate)
      node.removeEventListener('keydown', keydown)
    }
  }
}
