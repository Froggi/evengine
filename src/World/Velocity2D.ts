
import {Entity} from '../Entity'
import {Position2D} from './Position2D'
import {addListener, deltaTime} from '../Handler'

export interface Velocity2D {
  velX:number
  velY:number
}

export default (e:Entity&Velocity2D):string => {
  e.velX = 0;
  e.velY = 0;

  return "Velocity2D"
}
addListener("Velocity2D.Update", update)

function update(e:Entity&Position2D&Velocity2D) {
  e.x += e.velX * deltaTime
  e.y += e.velY * deltaTime
}