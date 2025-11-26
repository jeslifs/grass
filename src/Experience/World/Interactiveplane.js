import * as THREE from 'three'
import Experience from '../Experience'


export default class InteractivePlane
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.playerState = this.experience.state.character

        // setup
        this.set2DCanvas()

    }

    set2DCanvas()
    {
        this.displacement = {}
        this.displacement.canvas = document.createElement('canvas')
        this.displacement.canvas.width = 128
        this.displacement.canvas.height = 128

        
        // to see the canvas on the screen
        this.displacement.canvas.style.position = 'fixed'
        this.displacement.canvas.style.width = '256px'
        this.displacement.canvas.style.height = '256px'
        this.displacement.canvas.style.top = 0
        this.displacement.canvas.style.left = 0
        this.displacement.canvas.style.zIndex = 10

        // document.body.appendChild(this.displacement.canvas)

        // Context
        this.displacement.context = this.displacement.canvas.getContext('2d')
        this.displacement.context.fillRect(0, 0, this.displacement.canvas.width, this.displacement.canvas.height)


        // Glow image
        this.displacement.glowImage = new Image()
        this.displacement.glowImage.src = 'textures/glow/glow.png'

        // Interactive Plane
        this.displacement.interactivePlane = new THREE.Mesh(
            new THREE.PlaneGeometry(24, 24),
            new THREE.MeshBasicMaterial({
                // color: 'red',
                visible: false,
            })
        )
        // this.displacement.interactivePlane.position.y = 5
        this.displacement.interactivePlane.rotation.x = - Math.PI / 2
        this.scene.add(this.displacement.interactivePlane)

        // Raycaster
        this.displacement.raycaster = new THREE.Raycaster()
        
        // Mouse Coordinates
        this.displacement.screenCursor = new THREE.Vector2(9999, 9999)
        this.displacement.canvasCursor = new THREE.Vector2(9999, 9999)
        this.displacement.canvasCursorPrevious = new THREE.Vector2(9999, 9999)

        // glow size
        this.displacement.glowSize = this.displacement.canvas.width * 0.25

        window.addEventListener('pointermove', (event) =>
        {
            this.displacement.screenCursor.x = (event.clientX / this.sizes.width) * 2 - 1
            this.displacement.screenCursor.y = -(event.clientY / this.sizes.height) * 2 + 1
        })

        // Displacement texture
        this.displacement.texture = new THREE.CanvasTexture(this.displacement.canvas)

    }

    update()
    {
        // update interactive plane position
        this.displacement.interactivePlane.position.set(this.playerState.position.x, 0, this.playerState.position.z)

        // Raycaster
        this.displacement.raycaster.setFromCamera(this.displacement.screenCursor, this.experience.camera.instance)
        const intersections = this.displacement.raycaster.intersectObject(this.displacement.interactivePlane)
        // console.log(intersections)
        if(intersections.length > 0)
        {
            const uv = intersections[0].uv
            // console.log(uv)
            
            this.displacement.canvasCursor.x = uv.x * this.displacement.canvas.width
            this.displacement.canvasCursor.y =  (1 - uv.y) * this.displacement.canvas.height
        }

        // Displacement canvas

        // Fade Effect
        this.displacement.context.globalCompositeOperation = 'source-over'
        this.displacement.context.globalAlpha = 0.01
        this.displacement.context.fillRect(0, 0, this.displacement.canvas.width, this.displacement.canvas.height)
        

        // Speed
        const speed = this.displacement.canvasCursorPrevious.distanceTo(this.displacement.canvasCursor)
        this.displacement.canvasCursorPrevious.copy(this.displacement.canvasCursor)
        const alpha = Math.min(speed * 0.1, 1)

        // Draw Glow
        
        this.displacement.context.globalCompositeOperation = 'lighten'
        this.displacement.context.globalAlpha = alpha
        this.displacement.context.drawImage(
            this.displacement.glowImage,
            this.displacement.canvasCursor.x - this.displacement.glowSize * 0.5,
            this.displacement.canvasCursor.y - this.displacement.glowSize * 0.5,
            this.displacement.glowSize,
            this.displacement.glowSize
        )
        
        // Update Canvastexture
        this.displacement.texture.needsUpdate = true        
    }

}