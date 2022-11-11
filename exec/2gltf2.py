# 
# The MIT License (MIT)
#
# Copyright (c) since 2017 UX3D GmbH
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
# 

#
# Imports
#

import os
import sys
import zipfile
from os.path import basename

import bpy
from bpy import context
from PIL import Image

#
# Globals
#

#
# Functions
#

bpy.ops.object.delete()

current_directory = os.getcwd()

force_continue = True

for current_argument in sys.argv:

    if force_continue:
        if current_argument == '--':
            force_continue = False
        continue

    #

    root, current_extension = os.path.splitext(current_argument)
    current_basename = os.path.basename(root)
    if current_extension != ".abc" and current_extension != ".blend" and current_extension != ".dae" and current_extension != ".fbx" and current_extension != ".obj" and current_extension != ".ply" and current_extension != ".stl" and current_extension != ".usd" and current_extension != ".usda" and current_extension != ".usdc" and current_extension != ".wrl" and current_extension != ".x3d":
        continue

    if current_extension == ".abc":
        bpy.ops.wm.alembic_import(filepath=current_argument)    

    if current_extension == ".blend":
        bpy.ops.wm.open_mainfile(filepath=current_argument)

    if current_extension == ".dae":
        bpy.ops.wm.collada_import(filepath=current_argument)    

    if current_extension == ".fbx":
        bpy.ops.import_scene.fbx(filepath=current_argument)    

    if current_extension == ".obj":
        #Changing material roughness        
        bpy.ops.import_scene.obj(filepath=current_argument)    
        bpy.context.view_layer.objects.active = bpy.context.selected_objects[0]
        mat = bpy.context.object.data.materials[0]
        base_node = mat.node_tree.nodes['Principled BSDF']
        base_node.inputs['Roughness'].default_value = 1

    if current_extension == ".ply":      
        bpy.ops.import_mesh.ply(filepath=current_argument)
        #Making empty image to bake texture
        
        image_name = bpy.context.active_object.name + '_tex'
        bpy.context.view_layer.objects.active = bpy.context.selected_objects[0]
        img = bpy.data.images.new(image_name,2048,2048)
        #Allocating material
        mat = bpy.data.materials.get("Material")        
        if len(bpy.context.active_object.data.materials) == 0:
            bpy.context.active_object.data.materials.append(bpy.data.materials['Material'])
        else:
            bpy.context.active_object.data.materials[0] = bpy.data.materials['Material']

        #Ready to bake
        if mat:
            mat.node_tree.nodes.new("ShaderNodeVertexColor")
            base_node = mat.node_tree.nodes['Principled BSDF']
            base_node.inputs['Roughness'].default_value = 1
            mat.node_tree.links.new(mat.node_tree.nodes[2].outputs['Color'], base_node.inputs['Base Color'])

            mat.use_nodes = True
            texture_node =mat.node_tree.nodes.new('ShaderNodeTexImage')
            texture_node.name = 'Bake_node'
            texture_node.select = True
            mat.node_tree.nodes.active = texture_node
            texture_node.image = img #Assign the image to the node
        
        #UV Mapping
        bpy.ops.object.editmode_toggle()
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.uv.smart_project(angle_limit=1.55334)
        bpy.ops.object.editmode_toggle()

        #Baking Texture and save
        bpy.context.scene.render.engine = 'CYCLES'
        bpy.context.scene.cycles.bake_type = 'DIFFUSE'
        bpy.context.scene.render.bake.use_pass_direct = False
        bpy.context.scene.render.bake.use_pass_indirect = False
        bpy.context.scene.render.bake.margin = 0

        bpy.context.view_layer.objects.active = bpy.context.active_object
        bpy.ops.object.bake(type='DIFFUSE', save_mode='EXTERNAL')

        # img.save_render('scene.png')
        
        if mat:
            mat.node_tree.links.new(texture_node.outputs['Color'], base_node.inputs['Base Color'])

        #Making .zip file
        # zip_file = zipfile.ZipFile(file_loc_export+os.path.splitext(model)[0]+'.zip', "w")
        #zip_file.write(file_loc_export + 'scene.png', basename(file_loc_export + 'scene.png'), compress_type=zipfile.ZIP_DEFLATED)

        #Rendering thumbnail
        # bpy.ops.view3d.camera_to_view_selected()
        # bpy.ops.render.render(write_still = 1)   

        #Creating gray-background thumnnail.png file
        # im = Image.open(scene.render.filepath)
        # nim = Image.new(mode = "RGBA", size = im.size, color = (240, 240, 240))
        # nim.paste(im, (0, 0), im)
        # nim.save(scene.render.filepath)
        # zip_file.write(scene.render.filepath, basename(scene.render.filepath), compress_type=zipfile.ZIP_DEFLATED)

        #Exporting .glb file
        # bpy.ops.export_scene.gltf(filepath='scene.glb', export_materials='EXPORT', export_format='GLB')
        # zip_file.write(file_loc_export + 'scene.glb', basename(file_loc_export + 'scene.glb'), compress_type=zipfile.ZIP_DEFLATED)

        #Clearing material
        # for mat in bpy.context.active_object.data.materials:
        #     for n in mat.node_tree.nodes:
        #         if n.name == 'Bake_node':
        #             mat.node_tree.nodes.remove(n)

        # bpy.ops.object.delete()
        # zip_file.close()

    if current_extension == ".stl":
        bpy.ops.import_mesh.stl(filepath=current_argument)

    if current_extension == ".usd" or current_extension == ".usda" or current_extension == ".usdc":
        bpy.ops.wm.usd_import(filepath=current_argument)

    if current_extension == ".wrl" or current_extension == ".x3d":
        bpy.ops.import_scene.x3d(filepath=current_argument)

    #

    export_file = current_directory + "/" + current_basename + ".gltf"
    print("Writing: '" + export_file + "'")
    bpy.ops.export_scene.gltf(filepath=export_file)
