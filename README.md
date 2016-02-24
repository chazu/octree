# TODO


* Query for points in sphere [STARTED]
* Query for points in conic frustrum
* Nearest neighbor search
* Start using OctantPoint class
* Add deferred insertion
* Allow tuning of splitting rules

# DONE
* Add bounding sphere to OctantPoint (radius)
* Finish and test OctreePoint

from http://stackoverflow.com/questions/7067742/range-search-within-specified-radius-in-an-octree
if (pX < minX of Cell)
    dx = |px - minX|
else if (px > maxX of Cell)
    dx = |px-maxX|
Same for other dimensions

return (|dx,dy,dz|<=r)