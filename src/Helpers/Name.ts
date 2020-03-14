import {Entity} from '../Entity'

export interface Name {
  name:string
}

export default (e:Entity&Name):string => {
  e.name = "test " + e.index
  return "Name"
}