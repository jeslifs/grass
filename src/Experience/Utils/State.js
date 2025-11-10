import * as THREE from 'three'

export default class State
{
    constructor()
    {

        // Character state
        this.character =
        {
            // current position
            position: new THREE.Vector3(0, 0.51, 0),

            // current velocity
            velocity: new THREE.Vector3(),

            // on ground?
            onGround: true,

        }
    }
}