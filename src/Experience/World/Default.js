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
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Default Cube')
        }


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
        this.mesh.position.y = .51
        this.scene.add(this.mesh)
    }

    update()
    {

    }
}