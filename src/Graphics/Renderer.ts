
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
  addListener("Position2D.Render", render.bind(e))
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
  if(!data.type || data.type === 'rect') {
    let offset = {
      x: data.offset ? data.offset.x : 0,
      y: data.offset ? data.offset.y : 0
    };
    let size = {
      width: data.size ? data.size.width : 10,
      height: data.size ? data.size.height : 10
    };
    (this.context as CanvasRenderingContext2D).fillRect(e.x+offset.x,e.y+offset.y,size.width,size.height)
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