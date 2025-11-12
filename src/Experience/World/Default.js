import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Default
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        // this.debug = this.experience.debug
        this.controls = this.experience.controls
        this.playerState = this.experience.state.character
        
        // options
        this.movement =
        {
            acceleration: 100,
            maxSpeed: 10,
            jumpStrength: 5,
            gravity: -9,
            friction: 10,
            boostAcceleration: 200,
            boostMaxSpeed: 20
        }

        this.tempVector = new THREE.Vector3()
        this.moveDirection = new THREE.Vector3()

        // Debug
        // if(this.debug.active)
        // {
        //     this.debugFolder = this.debug.ui.addFolder('Default Cube')
        //     this.debugFolder.close()
        // }


        this.setGeometry()
        this.setMaterial()
        this.setMesh()

    }


    setGeometry()
    {
        this.geometry = new THREE.BoxGeometry()
    }

    setMaterial()
    {
        this.material = new THREE.MeshNormalMaterial()
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        // this.mesh.position.y = .51
        // set cube position from state
        this.mesh.position.copy(this.playerState.position)
        this.scene.add(this.mesh)
    }

    update()
    {
        // friction
        this.playerState.velocity.x = THREE.MathUtils.lerp(
            this.playerState.velocity.x, // current velocity
            0,                          // target velocity (stop)
            this.movement.friction * this.time.delta / 1000 // smoothing factor
        )

        this.playerState.velocity.z = THREE.MathUtils.lerp(
            this.playerState.velocity.z, // current velocity
            0,                          // target velocity (stop)
            this.movement.friction * this.time.delta / 1000 // smoothing factor
        )

        // boost
        let currentMaxSpeed = this.movement.maxSpeed
        let currentAcceleration = this.movement.acceleration

        if(this.controls.keys.down.boost)
        {
            currentMaxSpeed = this.movement.boostMaxSpeed
            currentAcceleration = this.movement.boostAcceleration
        }

        // move directions
        this.moveDirection.set(0, 0, 0)
        
        if(this.controls.keys.down.forward)
            this.moveDirection.z -= 1
        if(this.controls.keys.down.backward)
            this.moveDirection.z += 1
        if(this.controls.keys.down.strafeLeft)
            this.moveDirection.x -= 1
        if(this.controls.keys.down.strafeRight)
            this.moveDirection.x += 1
            
        // Normalize movement
        if(this.moveDirection.length() > 0)
            this.moveDirection.normalize()
            
        // Apply Acceleration
        this.playerState.velocity.x += this.moveDirection.x * currentAcceleration * this.time.delta / 1000
        this.playerState.velocity.z += this.moveDirection.z * currentAcceleration * this.time.delta / 1000

        // Clamp Speed 
        const groundSpeed = Math.sqrt(this.playerState.velocity.x**2 + this.playerState.velocity.z**2)
        if(groundSpeed > currentMaxSpeed)
        {
            this.playerState.velocity.x = (this.playerState.velocity.x / groundSpeed) * currentMaxSpeed
            this.playerState.velocity.z = (this.playerState.velocity.z / groundSpeed) * currentMaxSpeed
        }

        // Gravity & Jump
        // Apply gravity only if not on the ground
        if(!this.playerState.onGround)
        {
            this.playerState.velocity.y += this.movement.gravity * this.time.delta / 1000
        }

        // jump
        if(this.controls.keys.down.jump && this.playerState.onGround)
        {
            this.playerState.velocity.y = this.movement.jumpStrength
            this.playerState.onGround = false
        }

        // Update State Position
        // position = position + velocity * time
        this.tempVector.copy(this.playerState.velocity).multiplyScalar(this.time.delta / 1000)
        this.playerState.position.add(this.tempVector)

        //  Ground Collision 
        if(this.playerState.position.y <= 0.51)
        {
            this.playerState.position.y = 0.51
            this.playerState.velocity.y = 0
            this.playerState.onGround = true
        }

        // Update  Mesh
        this.mesh.position.copy(this.playerState.position)       
    }
}