import EventEmitter from './EventEmitter'

export default class Controls extends EventEmitter
{
    constructor()
    {
        super()

        this.setKeys()
    }

    setKeys()
    {
        this.keys = {}

        this.keys.map = [
            {
                codes: ['ArrowUp', 'KeyW'],
                name: 'forward'
            },
            {
                codes: ['ArrowRight', 'KeyD'],
                name: 'strafeRight'
            },
            {
                codes: ['ArrowDown', 'KeyS'],
                name: 'backward'
            },
            {
                codes: ['ArrowLeft', 'KeyA'],
                name: 'strafeLeft'
            },
            {
                codes: ['ShiftLeft', 'ShiftRight'],
                name: 'boost'
            },
            {
                codes: ['Space'],
                name: 'jump'
            },
            {
                codes: ['Escape'],
                name: 'close'
            },
            
        ]

        // Down keys
        this.keys.down = {}

        for(const mapItem of this.keys.map)
        {
            this.keys.down[mapItem.name] = false
        }

        // Find in map per code
        this.keys.findPercode = (key) =>
        {
            return this.keys.map.find((mapItem) => mapItem.codes.includes(key))
        }

        // Event
        window.addEventListener('keydown', (event) => 
        {
            const mapItem = this.keys.findPercode(event.code)

            if(mapItem)
            {
                this.trigger('keyDown', [mapItem.name])
                // console.log(mapItem);
                this.keys.down[mapItem.name] = true
            }
        })

        window.addEventListener('keyup', (event) => 
        {
            const mapItem = this.keys.findPercode(event.code)

            if(mapItem)
            {
                this.trigger('keyUp', [mapItem.name])
                // console.log(mapItem);
                this.keys.down[mapItem.name] = false
            }
        })       
    }


}