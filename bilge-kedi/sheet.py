import sys,glob
from PIL import Image
d=sys.argv[1];fs=sorted(glob.glob(d+'/samples/t*.png'),key=lambda f:float(f.split('/t')[-1][:-4]))
ims=[Image.open(f).resize((270,480)) for f in fs];cols=6;rows=(len(ims)+cols-1)//cols
s=Image.new('RGB',(270*cols,480*rows))
for i,im in enumerate(ims): s.paste(im,((i%cols)*270,(i//cols)*480))
s.save(d+'/sheet.png')
