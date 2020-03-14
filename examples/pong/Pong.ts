import entity, {Entity} from '../../src/Entity'
import autoUpdate, {AutoUpdate} from '../../src/Helpers/AutoUpdate'
import position2D, {Position2D} from '../../src/World/Position2D'
import velocity2D, {Velocity2D} from '../../src/World/Velocity2D'
import renderer, {Renderer} from '../../src/Graphics/Renderer'
import handler, {Handler, initHandler, addListener, queueEvent, setHandler, MainHandler, deltaTime} from '../../src/Handler'

enum Side { Left, Right }

/*
================ PADDLES =================
*/

addListener("Paddle.Init", (e:Entity&Position2D) => {
  e.y = 100
})

let leftPaddle = entity().extend("Paddle").extend(position2D).extend(autoUpdate).extend("AI").set({x:10}).queueEvent("AutoUpdate.Start")

let rightPaddle = entity().extend("Paddle").extend(position2D).extend(autoUpdate).set({x:190}).queueEvent("AutoUpdate.Start")

addListener("Paddle.Update", (e:Entity&Position2D) => {
  queueEvent("Render", e ,{type: 'rect', offset: {x: -5, y:-20}, size: {width:10, height: 40}, color: 'blue'})
})
addListener("AI.Update", (e:Entity&Position2D) => {
  if(ball.y-20 > e.y) {
    e.y += 100 * deltaTime
  }else if(ball.y+20 < e.y) {
    e.y -= 100 * deltaTime
  }
})

addListener("Canvas.MouseMove", (e:Entity&Renderer, mousePosition) => {
  rightPaddle.y = mousePosition.y
})

/*
================ BALL =================
*/

addListener("Ball.Init", (e:Entity&Position2D&Velocity2D&AutoUpdate) => {
  e.x = 100
  e.y = 100
  e.velX = Math.random() > 0.5 ? 50 : -50
  e.velY = Math.random() * (Math.random() > 0.5 ? -50 : 50)
  e.alive = false
  setTimeout(() => queueEvent("AutoUpdate.Start", e), 500)
})

addListener("Ball.Update", (e:Entity&Position2D&Velocity2D&AutoUpdate) => {
  if(!e.alive) return;

  queueEvent("Render", e ,{type: 'rect', offset: {x: -5, y:-5}, size: {width:10, height: 10}, color: 'red'})

  if(e.velX < 0) {
    if(e.x-5 < leftPaddle.x+5 && e.y > leftPaddle.y-20 && e.y < leftPaddle.y+20) {
      e.velX = -e.velX*1.1;
      e.x = leftPaddle.x+10
      e.velY = -(leftPaddle.y-e.y)*8
    }
  }else if(e.velX > 0) {
    if(e.x+5 > rightPaddle.x-5 && e.y > rightPaddle.y-20 && e.y < rightPaddle.y+20) {
      e.velX = -e.velX*1.1;
      e.x = rightPaddle.x-10
      e.velY = -(rightPaddle.y-e.y)*8
    }
  }

  if(e.x < 5) {
    queueEvent("Ball.Init", e,null,true)
    queueEvent("Ball.Out", e, {side: Side.Left})
    return
  }
  if(e.y < 5) {
    e.velY = -e.velY;
    e.y = 5
  }
  if(e.x > 200-5) {
    queueEvent("Ball.Init", e,null,true)
    queueEvent("Ball.Out", e, {side: Side.Right})
    return
  }
  if(e.y > 200-5) {
    e.velY = -e.velY;
    e.y = 200-5
  }
})
let ball = entity().extend(position2D).extend(velocity2D).extend(autoUpdate).extend("Ball")

/*
================ POINTS =================
*/

interface Points {
  points: {[side:number]:number}
}

const points = (e:Entity&Position2D&Points):string => {
  e.points = {
    [Side.Left]: 0,
    [Side.Right]: 0
  }
  e.x = 100
  e.y = 20
  return "Points"
}

let p = entity().extend(position2D).extend(autoUpdate).extend(points).queueEvent("AutoUpdate.Start")

addListener("Points.Update", (e:Entity&Position2D&Points) => {
  queueEvent("Render", e ,{type: 'text', text: e.points[Side.Left], offset: {x: -30, y:0}, size: {width:10}, color: 'white'})
  queueEvent("Render", e ,{type: 'text', text: e.points[Side.Right], offset: {x: 30, y:0}, size: {width:10}, color: 'white'})
})

addListener("Ball.Out", (e:Entity&Position2D&Points, data) => {
  if(data.side == Side.Left) {
    p.points[Side.Right]++
  }else if(data.side == Side.Right) {
    p.points[Side.Left]++
  }
})

/*
================ RENDER AND MOUSE =================
*/


let theRenderer = entity().extend(renderer)
let canvas:HTMLCanvasElement = document.getElementById('mainCanvas') as HTMLCanvasElement
canvas.addEventListener('click', function(event) {
    var x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;
    
    queueEvent("Canvas.Click", theRenderer, {x,y})
})
canvas.addEventListener('mousemove', function(event) {
    var x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;
    
    queueEvent("Canvas.MouseMove", theRenderer, {x,y})
})
queueEvent("Renderer.SetContext", theRenderer, canvas.getContext("2d"))