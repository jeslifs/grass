import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.state = this.experience.state.character

        // setup
        this.offset = new THREE.Vector3(0, 8, 20)
        this.lerpFactor = 0.05

        this.setInstance()
        this.setControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 1000)
        this.instance.position.set(
            this.state.position.x + this.offset.x,
            this.state.position.y + this.offset.y,
            this.state.position.z + this.offset.z
        )
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.target.copy(this.state.position)
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        const targetPosition = this.state.position

        // 2. Calculate the ideal camera position (player pos + fixed offset)
        const idealPosition = new THREE.Vector3().copy(targetPosition)
        idealPosition.add(this.offset)

        // 3. Smoothly move (lerp) the camera towards that ideal position
        this.instance.position.lerp(idealPosition, this.lerpFactor)

        // 4. Always make the camera look at the player
        this.instance.lookAt(targetPosition)
        // this.controls.update()
    }
}