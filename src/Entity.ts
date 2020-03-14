
import {queueEvent} from './Handler'

export interface Entity {
  index:number
  extenders:Array<string>
  extend:(typeInit:(e:any) => string) => Entity
}

let indexCounter = 1;
export default ():any => {
  let e:Entity = {
    index: indexCounter, 
    extenders: [],
    extend: function(typeInit:(e:any) => any|string):any {
      let typeName = ''
      if(typeof(typeInit) === 'string') {
        typeName = typeInit
      }else {
        typeName = typeInit(this)
      }
      this.extenders.push(typeName)
      queueEvent(typeName+".Init", e)
      return this
    }
  }
  indexCounter++
  queueEvent("Entity.Init", e)
  
  return e
}

