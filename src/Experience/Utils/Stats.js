import Stats from 'three/examples/jsm/libs/stats.module.js'

export default class StatsJS
{
    constructor()
    {
        this.instance = new Stats()
        this.instance.showPanel(0)
        document.body.appendChild(this.instance.dom)
    }

    begin()
    {
        this.instance.begin()
    }

    end()
    {
        this.instance.end()
    }
}