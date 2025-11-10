import * as THREE from 'three'
import Experience from '../Experience'
import Vertex from '../Shaders/Grass/vertex.glsl'
import Fragment from '../Shaders/Grass/fragment.glsl'


export default class Grass
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // setup
        this.size = 64
        this.plane = 200
        this.count = this.plane * this.plane
        this.fragmentSize = this.size / this.plane
        this.bladeWidthRatio = 1.5
        this.bladeHeightRatio = 4
        this.positionRandomness = 0.5
        this.bladeHeightRandomness = 0.5

        this.setGeometry()
        this.setMaterial()
        this.setGrass()
    }

    setGeometry()
    {
        // this.geometry = new THREE.PlaneGeometry(30, 30)

        // centers
        const centers = new Float32Array(this.count * 3 * 2)

        // positions
        const positions = new Float32Array(this.count * 3 * 3)

        // grid
        for(let x = 0; x < this.plane; x++)
        {
            // center of each cell on x axis
            const cellCenterX = (x / this.plane - 0.5) * this.size + this.fragmentSize * 0.5
            for(let z = 0; z < this.plane; z++)
            {
                // center of each cell on z axis
                const cellCenterZ = (z / this.plane - 0.5) * this.size + this.fragmentSize * 0.5

                // index's of positions and centers
                const positionIndex = (x * this.plane + z) * 9
                const centerIndex = (x * this.plane + z) * 6

                // randomness for each blade in the cell
                const centerX = cellCenterX + (Math.random() - 0.5) * this.fragmentSize * this.positionRandomness
                const centerZ = cellCenterZ + (Math.random() - 0.5) * this.fragmentSize * this.positionRandomness

                // Centers

                // vertex 1
                centers[centerIndex ] = centerX
                centers[centerIndex + 1] = centerZ

                // vertex 2
                centers[centerIndex + 2] = centerX
                centers[centerIndex + 3] = centerZ
                
                // vertex 3
                centers[centerIndex + 4] = centerX
                centers[centerIndex + 5] = centerZ

                // Positions

                const bladeWidth = this.fragmentSize * this.bladeWidthRatio
                const bladeHalfWidth = bladeWidth * 0.5
                
                const bladeHeight = this.fragmentSize * this.bladeHeightRatio * (1 - 0.5 + Math.random() * 0.5)

                // vertex 1
                positions[positionIndex ] = - bladeHalfWidth
                positions[positionIndex + 1] = 0
                positions[positionIndex + 2] = 0

                // vertex 2
                positions[positionIndex + 3] = 0
                positions[positionIndex + 4] = bladeHeight
                positions[positionIndex + 5] = 0

                // vertex 3
                positions[positionIndex + 6] = bladeHalfWidth
                positions[positionIndex + 7] = 0
                positions[positionIndex + 8] = 0

            }

        }
        
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('center', new THREE.Float32BufferAttribute(centers, 2))
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        // console.log(this.geometry)
        
    }

    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            // color: 'green',
            // wireframe: true,
            // side: THREE.DoubleSide,
            vertexShader: Vertex,
            fragmentShader: Fragment,
        })
    }

    setGrass()
    {
        this.grass = new THREE.Mesh(this.geometry, this.material)
        this.grass.frustumCulled = false

        // this.grass.rotation.x = - Math.PI * 0.5
        this.scene.add(this.grass)
    }
}