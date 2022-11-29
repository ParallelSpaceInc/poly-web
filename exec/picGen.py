import os
import sys

import bpy

# remove cube and default light
bpy.ops.object.delete()
# remove defaults lights
for obj in bpy.data.objects:
    if obj.type == 'LIGHT':
        obj.select_set(True)
    else:
        obj.select_set(False)
bpy.ops.object.delete()


# set camera clip range
bpy.data.cameras['Camera'].clip_end = 1000
bpy.data.cameras['Camera'].clip_start = 0.1

force_continue = True

for current_argument in sys.argv:

    if force_continue:
        if current_argument == '--':
            force_continue = False
        continue

    root, current_extension = os.path.splitext(current_argument)
    current_basename = os.path.basename(root)
    dirPath = os.path.dirname(current_argument)
    
    # if extension is not supported, skip
    if current_extension != ".gltf" and current_extension != ".glb":
        continue

    # import gltf object
    bpy.ops.import_scene.gltf(filepath=current_argument)

    # select all meshes
    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            obj.select_set(True)
        else:
            obj.select_set(False)

    # select gltf object
    obj = bpy.context.view_layer.objects.active = bpy.context.selected_objects[0]
    
    if obj.dimensions:
        mutiplier = 1/obj.dimensions.x
        # resize object
        bpy.ops.transform.resize(value=(mutiplier, mutiplier, mutiplier))

    # make camera look at the object to fit the object in the camera view
    bpy.ops.view3d.camera_to_view_selected()

    bpy.ops.transform.resize(value=(1.1, 1.1, 1.1))
    
    # set the render background white
    bpy.data.worlds['World'].node_tree.nodes['Background'].inputs[0].default_value = (1, 1, 1, 1)
    bpy.data.worlds['World'].node_tree.nodes['Background'].inputs[1].default_value = 3

    # add a bright directional light
    # bpy.ops.object.light_add(type='SUN', location=(0, 0, 10), rotation=(-1, -1, -10))
    # bpy.data.objects['Sun'].data.energy = 1

    # set the render resolution
    bpy.context.scene.render.resolution_x = 512
    bpy.context.scene.render.resolution_y = 384


    # set render path
    bpy.context.scene.render.filepath = os.path.join(dirPath, "thumbnail.png")

    # post process the render to clean the edges with cycles
    bpy.context.scene.render.engine = 'CYCLES'
    bpy.context.scene.cycles.samples = 100
    bpy.context.scene.cycles.max_bounces = 0
    bpy.context.scene.cycles.min_bounces = 0
    bpy.context.scene.cycles.diffuse_bounces = 0
    bpy.context.scene.cycles.glossy_bounces = 0
    bpy.context.scene.cycles.transparent_max_bounces = 0
    bpy.context.scene.cycles.transparent_min_bounces = 0
    
    # render the object
    bpy.ops.render.render(write_still=True)