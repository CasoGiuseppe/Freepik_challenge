export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const errorHandle = (res) => res.ok ?? new Error(`error: ${res.statusText}`)
