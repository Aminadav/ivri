//@ts-nocheck
interface a{
  updateStore:()=>void
  useRerenderIfChange:(callback)=>void
}

export function newStore<T>(state:T):(a & T) {
}


