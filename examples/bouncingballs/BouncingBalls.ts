
import entity, {Entity} from '../../src/Entity'
import name, {Name} from '../../src/Helpers/Name'
import autoUpdate, {AutoUpdate} from '../../src/Helpers/AutoUpdate'
import position2D, {Position2D} from '../../src/World/Position2D'
import velocity2D, {Velocity2D} from '../../src/World/Velocity2D'
import gravity2D, {Gravity2D, setGravity} from '../../src/World/Gravity2D'
import collision2D, {Collision2D, setQuadTree} from '../../src/World/Collision/Collision2D'
import timeToLive, {TimeToLive} from '../../src/Helpers/TimeToLive'
import handler, {Handler, initHandler, addListener, queueEvent, setHandler, MainHandler} from '../../src/Handler'
import renderer, {Renderer} from '../../src/Graphics/Renderer'


let theRenderer = entity().extend(renderer)
let canvas:HTMLCanvasElement = document.getElementById('mainCanvas') as HTMLCanvasElement
canvas.addEventListener('click', function(event) {
    var x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;
    
    queueEvent("Canvas.Click", theRenderer, {x,y})
})
queueEvent("Renderer.SetContext", theRenderer, canvas.getContext("2d"))

setQuadTree(400,10)

addListener("Entity.Init", (e) => e.extend(name))

addListener("Game.Init", (e:Entity) => {
  setGravity(300)
  for(let i = 0; i < 10; i++) {
    let go = entity().extend(autoUpdate).extend(position2D).extend(velocity2D).extend(gravity2D).extend(timeToLive)
    go.x = i* 15
    go.y = -5 * i
    queueEvent("AutoUpdate.Start", go)
  }
  let toRight = entity().extend(autoUpdate).extend(position2D).extend(velocity2D).extend(gravity2D).extend(timeToLive)
  toRight.y = 50
  toRight.velX = 100
  toRight.velY = -150
  queueEvent("AutoUpdate.Start", toRight)

})

setInterval(() => {
  let toRight = entity().extend(autoUpdate).extend(position2D).extend(velocity2D).extend(gravity2D).extend(timeToLive)
  toRight.y = 50
  toRight.velX = 100
  toRight.velY = -150
  toRight.timeLeft = 2
  queueEvent("AutoUpdate.Start", toRight)
  setTimeout(() => {
    let shot = entity().extend(autoUpdate).extend(position2D).extend(velocity2D).extend(gravity2D).extend(timeToLive)
    shot.x = toRight.x
    shot.y = toRight.y
    shot.velX = toRight.x+50
    shot.velY = -150
    shot.timeLeft = 2
    queueEvent("AutoUpdate.Start", shot)
  },1100)

}, 5000)

addListener("Canvas.Click", (e:Entity, data:any) => {
  let toRight = entity().extend(autoUpdate).extend(position2D).extend(velocity2D).extend(gravity2D).extend(timeToLive).extend(collision2D)
  toRight.x = data.x
  toRight.y = data.y
  toRight.velX = 100
  toRight.velY = -150
  toRight.timeLeft = 2
  toRight.name2 = "Test"
  queueEvent("AutoUpdate.Start", toRight)
})

addListener("TimeToLive.Killed", (e:Entity&Name&Collision2D) => {
  if(e.name2 == "Test") {
    console.log(e.quadTreePaths)

  }
})

addListener("Position2D.Update", (e:Entity&Position2D) => {
  queueEvent("Position2D.Render", e)
})

addListener("Velocity2D.Update", (e:Entity&Position2D&Velocity2D&Collision2D) => {
  if(e.collision === undefined) {
    if(e.x < 0) {
      e.velX = -e.velX *0.8;
      e.x = 0
    }
    if(e.x > 200-10) {
      e.velX = -e.velX *0.8;
      e.x = 200-10
    }
    if(e.y > 200-10) {
      e.velY = -e.velY *0.8;
      e.y = 200-10
    }
    if(Math.abs(e.velY) < 0.001) {
      e.velY = 0
    }
  }else {
    console.log(e.collision)
    if(e.collision) {
      if(e.velX > 0) {
        e.velX = -e.velX *0.8;
        e.x -= 10
      }else if(e.velX < 0) {
        e.velX = -e.velX *0.8;
        e.x += 10
      }
    }
  }
})

let theGame = entity().extend("Game").extend(autoUpdate)

setTimeout(() => {
  console.log(theGame)
  
}, 5000)

