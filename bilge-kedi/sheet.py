import sys,glob
from PIL import Image
d=sys.argv[1];fs=sorted(glob.glob(d+'/samples/t*.png'),key=lambda f:float(f.split('/t')[-1][:-4]))
w,h=Image.open(fs[0]).size; land=w>h
tw,th=(480,270) if land else (270,480); cols=4 if land else 6
ims=[Image.open(f).resize((tw,th)) for f in fs];rows=(len(ims)+cols-1)//cols
s=Image.new('RGB',(tw*cols,th*rows))
for i,im in enumerate(ims): s.paste(im,((i%cols)*tw,(i//cols)*th))
s.save(d+'/sheet.png')
