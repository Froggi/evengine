
import {Entity} from '../Entity'
import {Position2D} from '../World/Position2D'
import autoUpdate, {AutoUpdate} from '../Helpers/AutoUpdate'
import {addListener, queueEvent} from '../Handler'

export interface Renderer {
  context:CanvasRenderingContext2D
  renderedThisFrame: boolean
}

export default (e:Entity&Renderer&AutoUpdate):string => {
  e.context = null
  addListener("Render", render.bind(e), 10, true)
  addListener("Renderer.Update", clear.bind(e), -10)
  e.extend(autoUpdate)
  e.prio = true
  e.renderedThisFrame = false

  return "Renderer"
}
addListener("Renderer.SetContext", setContext)

function setContext(e:Entity&Renderer, context:any ) {
  e.context = context
}

function render(e:Entity&Position2D, data:any = {}) {
  if(!this.context) return
  if(!data) data = {}
  this.context.fillStyle = data.color ? data.color :"red";
  let offset = {
    x: data.offset ? data.offset.x : 0,
    y: data.offset ? data.offset.y : 0
  };
  let size = {
    width: data.size ? data.size.width : 10,
    height: data.size ? data.size.height : 10
  };
  if(!data.type || data.type === 'rect') {
    (this.context as CanvasRenderingContext2D).fillRect(e.x+offset.x,e.y+offset.y,size.width,size.height)
  }else if(data.type === 'text') {
    let text = data.text !== undefined ? data.text : "###";
    (this.context as CanvasRenderingContext2D).fillText(text, e.x+offset.x, e.y+offset.y,size.width)
  }
  this.renderedThisFrame = true
  if(!this.alive) {
    this.alive = true
    queueEvent("AutoUpdate.Start", this)
    console.log("started renderer")
  }
}

function clear(e:Entity&Position2D) {
  if(!this.context) return
  if(!this.renderedThisFrame) {
    this.alive = false
    console.log("stopped renderer")
  }
  this.context.fillStyle = "black";
  (this.context as CanvasRenderingContext2D).fillRect(0,0,200,200)
  this.renderedThisFrame = false
}