attribute vec2 center;

#include ../includes/getRotatePivot2d.glsl

void main()
{

    // center
    vec2 newCenter = center;

    vec4 modelCenter = modelMatrix * vec4(newCenter.x, 0.0, newCenter.y, 1.0);



    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // grass to center
    modelPosition.xz += newCenter;

    // billboarding
    float angleToCamera = atan(modelCenter.x - cameraPosition.x, modelCenter.z - cameraPosition.z);
    modelPosition.xz = getRotatePivot2d(modelPosition.xz, angleToCamera, modelCenter.xz);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPositon = projectionMatrix * viewPosition;

    gl_Position = projectionPositon;
}