
import {Entity} from '../Entity'
import {AutoUpdate} from './AutoUpdate'
import {addListener, deltaTime,queueEvent} from '../Handler'

export interface TimeToLive {
  timeLeft:number
}

export default (e:Entity&TimeToLive):string => {
  e.timeLeft = 10;

  return "TimeToLive"
}

addListener("TimeToLive.Update", update)

function update(e:Entity&Position2D&AutoUpdate&TimeToLive) {
  e.timeLeft -= deltaTime
  if(e.timeLeft < 0) {
    e.alive = false
    queueEvent("TimeToLive.Killed", e)
  }
}