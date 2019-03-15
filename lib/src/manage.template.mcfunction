execute if data entity @s Item.tag._imp.manage{register: true} run data modify entity @s Item.tag._imp.temp.registrants append value %%registrant_nbt%%
execute if data entity @s Item.tag._imp.manage{install: ['%%module_namespace%%']} run function %%module_namespace%%:.module/setup
