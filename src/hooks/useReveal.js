import { useEffect } from 'react'

/**
 * Adds an IntersectionObserver that toggles the `is-visible` class on any
 * element with the `reveal` class as it scrolls into view. A MutationObserver
 * also picks up elements mounted later (e.g. when the project filter changes),
 * so they reveal correctly instead of staying hidden.
 */
export default function useReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    const observe = (root) => {
      root.querySelectorAll?.('.reveal:not(.is-visible)').forEach((el) => io.observe(el))
    }

    observe(document)

    // Watch for elements added after mount (filtered project cards, etc.)
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) => m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return
        if (node.classList?.contains('reveal') && !node.classList.contains('is-visible')) {
          io.observe(node)
        }
        observe(node)
      }))
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}
