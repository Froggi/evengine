
import {Entity} from '../../Entity'
import {Position2D} from '../Position2D'
import {addListener, deltaTime} from '../../Handler'

export enum CollisionShape {Point, Rectangle, Circle}

export interface Collision2D {
  collisionShape:CollisionShape
  collX1:number
  collY1:number
  collX2:number
  collY2:number
  collRad:number
  quadTreePaths:Array<number>
  collision:boolean
}

export default (e:Entity&Collision2D):string => {
  e.collisionShape = CollisionShape.Point
  e.collX1 = 0
  e.collY1 = 0
  e.collX2 = 0
  e.collY2 = 0
  e.collRad = 0
  e.quadTreePaths = []
  e.collision = false
  return "Collision2D"
}

let globalQuadTreeSize = 1000
let globalQuadTreeDepth = 10
export function setQuadTree(quadTreeSize:number, quadTreeDepth:number) {
  globalQuadTreeSize = quadTreeSize
  globalQuadTreeDepth = quadTreeDepth
}

addListener("Collision2D.Update", update)

function update(e:Entity&Position2D&Collision2D) {
  e.quadTreePaths = []
  recursePath(e,0,0)
  if(e.quadTreePaths.length < 10) {
    e.collision = true
  }else {
    e.collision = false
  }
}

function recursePath(e:Entity&Position2D&Collision2D, x:number, y:number, depth:number=1) {
  let currentSize = globalQuadTreeSize / depth
  let currentBoxSize = currentSize / 2
  let topLeftX = (x-currentBoxSize)
  let topLeftY = (y-currentBoxSize)
  let xNum = Math.floor(((e.x-topLeftX)/currentSize)*2)
  let yNum = Math.floor(((e.y-topLeftY)/currentSize)*2)
  if(xNum > 1 || xNum < 0 || yNum > 1 || yNum < 0) {
    return
  }
  let boxNum = xNum+yNum*2
  e.quadTreePaths.push(boxNum)
  if(depth < globalQuadTreeDepth) {
    let halfCurrentBoxSize = currentBoxSize / 2
    recursePath(e, topLeftX+(xNum*currentBoxSize)+halfCurrentBoxSize, topLeftY+(yNum*currentBoxSize)+halfCurrentBoxSize, depth + 1)
  }
}