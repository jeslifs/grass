import Experience from '../Experience.js'
import Default from './Default.js'
import Environment from './Environment.js'
import Grass from './Grass.js'

export default class World
{
    constructor(interactivePlane)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            // this.floor = new Floor()
            // this.fox = new Fox()
            this.default = new Default()
            this.grass = new Grass(interactivePlane)
            this.environment = new Environment()
        })
    }

    update()
    {
        if(this.default)
            this.default.update()

        if(this.grass)
            this.grass.update()
    }
}