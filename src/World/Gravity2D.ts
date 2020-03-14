
import {Entity} from '../Entity'
import {Position2D} from './Position2D'
import {Velocity2D} from './Velocity2D'
import {addListener, deltaTime} from '../Handler'

export interface Gravity2D {
}

let globalGravity = 0

export default (e:Entity&Gravity2D):string => {
  
  return "Gravity2D"
}

addListener("Gravity2D.Update", update)

function update(e:Entity&Position2D&Velocity2D) {
  e.velY += globalGravity * deltaTime
}

export function setGravity(gravity:number) {
  globalGravity = gravity
}