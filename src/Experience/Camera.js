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
                this.playerState = this.experience.state.character
                this.keyControls = this.experience.controls

                // camera setup
                this.isFollowing = true
                this.lerpFactor = 0.05
                this.offset = new THREE.Vector3(0, 8, 12)

                this.setInstance()
                this.setControls()
                this.setEventHandlers()
        }

        setInstance()
        {
                this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 1000)
                this.instance.position.copy(this.playerState.position).add(this.offset)
                this.scene.add(this.instance)
        }

        setControls()
        {
                this.controls = new OrbitControls(this.instance, this.canvas)
                this.controls.enableDamping = true
                this.controls.target.copy(this.playerState.position)
        }

        setEventHandlers()
        {
                this.controls.addEventListener('start', () => 
                {
                        this.isFollowing = false
                })

                this.keyControls.on('keyDown', (keyName) => 
                {
                        if(keyName === 'forward' || keyName === 'backward' || keyName === 'strafeLeft' || keyName === 'strafeRight')
                        {
                                this.isFollowing = true
                        }
                })
        }

        resize()
        {
                this.instance.aspect = this.sizes.width / this.sizes.height
                this.instance.updateProjectionMatrix()
        }

        update()
        {
                const targetPosition = this.playerState.position

                if(this.isFollowing)
                {
                        this.controls.target.lerp(targetPosition, this.lerpFactor)
                        const idealPosition = new THREE.Vector3().copy(targetPosition)
                        idealPosition.add(this.offset)
                        this.instance.position.lerp(idealPosition, this.lerpFactor)
                }
                this.controls.update()
        }
}