
import entity, {Entity} from './Entity'

let running = false
let preAddedListeners = {}

export interface Handler {
  listeners:{[event:string]:Array<{func: (e:any) => any, priority:number}>}
  queue:Array<Array<() => any>>
  currentQueue:number
}
const handler = (e:Entity&Handler):string => {
  e.listeners = {}
  e.queue = [[],[]]
  e.currentQueue = 0
  return "Handler"
}
export default handler

export function initHandler() {
  let mainHandler:Entity&Handler = entity().extend(handler)
  mainHandler.listeners = preAddedListeners
  preAddedListeners = {};
  setHandler(mainHandler)
}

export function addListener(event:string, func:(e:any, data?:any) =>any, priority:number = 10):any {
  let e = MainHandler
  let listeners = preAddedListeners
  if(e) {
    listeners = e.listeners
  }
  if(!listeners[event]) {
    listeners[event] = []
  }
  listeners[event].push({
    func,
    priority
  })
  if(listeners[event].length > 1) {
    listeners[event].sort((a,b) => a.priority-b.priority)
  }
  return e
}

export function queueEvent(event:string, eA:Entity, data:any = null, priority:boolean = false):any {
  let e = MainHandler
  if(!e) return
  if(event.substr(0,1) == '.') {
    eA.extenders.forEach((extend:string) => queueEvent(extend+event, eA, data, priority))
    return
  }
  if(e.listeners[event]) {
    for(let listener of e.listeners[event]) {
      if(priority) {
        e.queue[e.currentQueue==0?1:0].unshift(listener.func.bind(eA, eA, data))
      }else {
        e.queue[e.currentQueue==0?1:0].push(listener.func.bind(eA, eA, data))
      }
    }
    if(!running) {
      running = true
      e.currentQueue = e.currentQueue==0?1:0
      requestAnimationFrame(runEvent.bind(this,e))
      console.log("started running")
    }
  }
  return eA
}

let lastTimestamp = null
export var deltaTime = 0

function runEvent(e:Entity&Handler){
  for(let i = 0; i < e.queue[e.currentQueue].length; i++) {
    e.queue[e.currentQueue][i]()
  }
  e.queue[e.currentQueue] = []
  e.currentQueue = e.currentQueue==0?1:0

  if(e.queue[e.currentQueue].length > 0) {
    requestAnimationFrame((timestamp) => {
      if(lastTimestamp) {
        deltaTime = (timestamp - lastTimestamp) / 1000
      }
      lastTimestamp = timestamp
      runEvent(e)

    })
  }else {
    running = false
    deltaTime = 0
    console.log("stopped running")
  }
}

export var MainHandler:Entity&Handler = null
export function setHandler(handler:Entity&Handler) {
  MainHandler = handler
}