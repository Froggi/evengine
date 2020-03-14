import entity, {Entity} from '../../src/Entity'
import autoUpdate, {AutoUpdate} from '../../src/Helpers/AutoUpdate'
import position2D, {Position2D} from '../../src/World/Position2D'
import velocity2D, {Velocity2D} from '../../src/World/Velocity2D'
import renderer, {Renderer} from '../../src/Graphics/Renderer'
import handler, {Handler, initHandler, addListener, queueEvent, setHandler, MainHandler, deltaTime} from '../../src/Handler'

/*
================ PADDLES =================
*/

enum Side { Left, Right }

interface Paddle {
  side:Side
}

const paddle = (e:Entity&Paddle):string => {
  e.side = Side.Left
  return "Paddle"
}

let paddles = {
  [Side.Left]: entity().extend(paddle).extend(position2D).extend(autoUpdate).extend("AI"),
  [Side.Right]: entity().extend(paddle).extend(autoUpdate).extend(position2D)
}
paddles[Side.Left].x = 10
paddles[Side.Left].y = 100

paddles[Side.Right].side = Side.Right
paddles[Side.Right].x = 190

addListener("Paddle.Update", (e:Entity&Position2D) => {
  queueEvent("Position2D.Render", e ,{type: 'rect', offset: {x: -5, y:-20}, size: {width:10, height: 40}, color: 'blue'})
})
addListener("AI.Update", (e:Entity&Position2D) => {
  if(ball.y-20 > e.y) {
    e.y += 100 * deltaTime
  }else if(ball.y+20 < e.y) {
    e.y -= 100 * deltaTime
  }
})

queueEvent("AutoUpdate.Start", paddles[Side.Left])
queueEvent("AutoUpdate.Start", paddles[Side.Right])

addListener("Canvas.MouseMove", (e:Entity&Renderer, mousePosition) => {
  paddles[Side.Right].y = mousePosition.y
})

/*
================ BALL =================
*/

addListener("Ball.Init", (e:Entity&Position2D&Velocity2D) => {
  e.x = 100
  e.y = 100
  e.velX = Math.random() > 0.5 ? 50 : -50
  e.velY = Math.random() * (Math.random() > 0.5 ? -50 : 50)
})

addListener("Ball.Update", (e:Entity&Position2D&Velocity2D) => {
  queueEvent("Position2D.Render", e ,{type: 'rect', offset: {x: -5, y:-5}, size: {width:10, height: 10}, color: 'red'})

  if(e.velX < 0) {
    if(e.x-5 < paddles[Side.Left].x+5 && e.y > paddles[Side.Left].y-20 && e.y < paddles[Side.Left].y+20) {
      e.velX = -e.velX*1.1;
      e.x = paddles[Side.Left].x+10
      e.velY = -(paddles[Side.Left].y-e.y)*8
    }
  }else if(e.velX > 0) {
    if(e.x+5 > paddles[Side.Right].x-5 && e.y > paddles[Side.Right].y-20 && e.y < paddles[Side.Right].y+20) {
      e.velX = -e.velX*1.1;
      e.x = paddles[Side.Right].x-10
      e.velY = -(paddles[Side.Right].y-e.y)*8
    }
  }

  if(e.x < 5) {
    queueEvent("Ball.Init", ball)
  }
  if(e.y < 5) {
    e.velY = -e.velY;
    e.y = 5
  }
  if(e.x > 200-5) {
    queueEvent("Ball.Init", ball)
  }
  if(e.y > 200-5) {
    e.velY = -e.velY;
    e.y = 200-5
  }
})
let ball = entity().extend(position2D).extend(velocity2D).extend(autoUpdate).extend("Ball")
queueEvent("AutoUpdate.Start", ball)



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