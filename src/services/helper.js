export function getLayers(c, type) {
  if (!c) return [];
  return c[type].concat(
    ...Object.values(c.comps || {}).map((c) => getLayers(c, type))
  );
}
