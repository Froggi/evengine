
import {Entity} from '../Entity'
import {Handler,addListener,queueEvent} from '../Handler'

export interface AutoUpdate {
  alive:boolean
  prio:boolean
}

let globalGravity = 0
let alive:Array<Entity&AutoUpdate> = []

export default (e:Entity&AutoUpdate):string => {
  e.alive = false
  e.prio = false

  return "AutoUpdate"
}

addListener("AutoUpdate.Start", start)
addListener("AutoUpdate.Update", update)

export function start(e:Entity&AutoUpdate) {
  e.alive = true
  queueEvent(".Update", e, null, e.prio)
}
function update(e:Entity&AutoUpdate) {
  if(e.alive) {
    queueEvent(".Update", e, null, e.prio)
  }
}