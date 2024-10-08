from sys import argv
from pathlib import Path
import os
import glob

# This tool converts plain text into Grenious readable xml files

"""
<title>Song Title</title>
<author>Optional author field</author>
<l>This is a lyric</l>
<br>
<l> This is a lyric with an 
    <an>
        annotation
        <in>Additional information here!</in>
    </an>
     and stuff of that sort
</l>
"""




# Conversion function
def convert_file(txt_file):
    # Turn double newlines into breaks
    with open(txt_file, "r", encoding="utf-8") as f:
        data = f.read()
        data = "\n<br>\n".join(data.split("\n\n"))
        data = data.split("\n")

    # Set title
    title = Path(txt_file).stem
    xml_out = [f"<title>{title}</title>", "<author>Author not listed</author>"]

    # Encase lines of text in <l>
    for i in data:
        if i != "<br>":
            xml_out.append(f"<l>{i}</l>")
        else:
            xml_out.append(i)

    # Decide where it will be saved
    try:
        out_path = argv[2]
        # a single asterisk means to save it in songs/{title}.xml
        if out_path == "*":
            out_path = f"songs/{title}.xml"
        else:
            # an asterisk in multiple places is replaced with {title}.xml
            out_path = out_path.replace("*", title + '.xml')
    except IndexError:
        # no argument means to just save to {title}.xml
        out_path = title + '.xml'

    # Save
    with open(out_path, "w", encoding="utf-8") as f:
        data_out = "\n".join(xml_out)
        f.write(data_out)

    # <an> and <in> tags are added manually

in_path = Path(argv[1])

if in_path.is_file():
    convert_file(str(in_path))
elif in_path.is_dir():
    files = glob.glob(os.path.join(str(in_path), "*.txt"))
    for file in files:
        print(f"Converting {file}")
        convert_file(file)