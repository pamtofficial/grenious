import glob,os

files = glob.glob("songs/*.xml")

registry = []

for i in files:
    registry.append(os.path.split(i)[-1].split(".xml")[0])

regstr = "const registry = [\n"

for i in registry:
    regstr += '"' + i + "\",\n"

regstr += "];"

with open("registry.js", "w", encoding='utf-8') as f:
    f.write(regstr)