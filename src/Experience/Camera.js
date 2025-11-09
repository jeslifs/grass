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

        // setup
        this.targetObject = null
        this.offest = new THREE.Vector2(0, 8, 12)
        this.lerpFactor = 0.05

        this.setInstance()
        this.setControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(6, 4, 8)
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    setTarget(object)
    {
        this.targetObject = object
    }

    update()
    {
        if(this.targetObject)
        {
            const idealPosition = new THREE.Vector3().copy(this.targetObject.position)
            idealPosition.add(this.offest)

            this.instance.position.lerp(idealPosition, this.lerpFactor)

            this.instance.lookAt(this.targetObject.position)
        }
        this.controls.update()
    }
}