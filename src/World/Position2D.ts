
import {Entity} from '../Entity'

export interface Position2D {
  x:number
  y:number
}

export default (e:Entity&Position2D):string => {
  e.x = 0;
  e.y = 0;
  return "Position2D"
}
