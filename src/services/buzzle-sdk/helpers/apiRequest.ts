export const apiRequest= async (uri:string, options?:RequestInit) => {
  const response = await fetch(uri, options);
  if (!response.ok) throw new Error((await response.json()).message);
  return await response.json();
};
