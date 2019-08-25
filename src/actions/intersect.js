/* global CustomEvent, IntersectionObserver */
let globalobserver
function getObserver () {
  if (!globalobserver && IntersectionObserver) {
    globalobserver = new IntersectionObserver(entries => {
      const onscreen = new Set()
      const offscreen = new Set()
      for (const entry of entries) {
        if (entry.isIntersecting) onscreen.add(entry.target)
        else offscreen.add(entry.target)
      }
      for (const ele of onscreen) {
        ele.dispatchEvent(new CustomEvent('intersectin'))
      }
      for (const ele of offscreen) {
        if (!onscreen.has(ele)) ele.dispatchEvent(new CustomEvent('intersectout'))
      }
    }, { rootMargin: '30px' })
  }
  return globalobserver
}

export default function intersect (node) {
  const observer = getObserver()
  if (!observer) {
    node.dispatchEvent(new CustomEvent('intersectin', { first: true }))
  } else {
    observer.observe(node)
  }
  return {
    destroy () {
      if (observer) observer.unobserve(node)
    }
  }
}
