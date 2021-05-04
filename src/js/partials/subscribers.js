const subscribers = {}

export const subscribe = (evt, callback) => {
  !Array.isArray(subscribers[evt]) ? subscribers[evt] = [] : null;
  subscribers[evt].push(callback)
}

export const publish = (evt, datas) => {
  if (!Array.isArray(subscribers[evt])) return
  subscribers[evt].forEach((node) => node(datas))
}

export const unsubscribe = (evt) => {
  const index = subscribers[evt].length - 1
  subscribers[evt].splice(index, 1)
}