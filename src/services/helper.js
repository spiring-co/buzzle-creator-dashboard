export function getLayers(c, type) {
  if (!c) return [];
  console.log(c);
  if (c[type]) {
    return c[type].concat(
      ...Object.values(c.comps || {}).map((c) => getLayers(c, type))
    );
  } else return [];
}
