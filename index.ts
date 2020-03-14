import './style.css';

import handler, {Handler, initHandler, addListener, queueEvent, setHandler, MainHandler} from './src/Handler'

initHandler()

let started = false

document.addEventListener('keydown', (e:KeyboardEvent) => {
  if(started) return
  document.getElementById("init-text").remove()

  if(e.key == 'a') {
    started = true
    import("./examples/bouncingballs/BouncingBalls")
  }else if(e.key == 'b') {
    started = true
    import("./examples/pong/Pong")
  }
})