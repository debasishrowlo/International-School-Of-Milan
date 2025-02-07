export const trimWithEllipsis = (s:string, max = 60) => {
  if (s.length <= max) {
    return s
  }

  return s.slice(0, 60) + "..."
}