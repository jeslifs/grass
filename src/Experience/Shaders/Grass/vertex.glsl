uniform vec3 uPlayerPosition;
uniform float uGrassSize;


attribute vec2 center;

#include ../includes/getRotatePivot2d.glsl

varying vec3 vColor;

void main()
{

    // center
    vec2 newCenter = center;

    // move the grass with the player position
    newCenter += uPlayerPosition.xz;

    vec4 modelCenter = modelMatrix * vec4(newCenter.x, 0.0, newCenter.y, 1.0);





    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // grass to center
    modelPosition.xz += newCenter;

    // tip of the blade
    float tip = step(2.0, mod(float(gl_VertexID) + 1.0, 3.0));

    // billboarding
    float angleToCamera = atan(modelCenter.x - cameraPosition.x, modelCenter.z - cameraPosition.z);
    modelPosition.xz = getRotatePivot2d(modelPosition.xz, angleToCamera, modelCenter.xz);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPositon = projectionMatrix * viewPosition;

    gl_Position = projectionPositon;

    // grass color
    // vec3 uGrassDefaultColor = vec3(0.52, 0.65, 0.26);
    // vec3 uGrassShaderColor = vec3(0.52 / 1.3, 0.65 / 1.3, 0.26 / 1.3);


    // gradient
    // vec3 lowColor = mix(uGrassShaderColor, uGrassDefaultColor, 0.2);
    // vec3 color = mix(lowColor, uGrassDefaultColor, tip);

    // vColor = color;
    vColor = vec3(tip/ 6.0);

}