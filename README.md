# TODO
* Query for points in sphere [STARTED]
** Write additional tests
* Query for points in conic frustrum
* Nearest neighbor search
* Add deferred insertion
* Allow tuning of splitting rules (multiple points per octant
* Check for collision on insertion/reinsertion
 - Assuming that reinsertion will be just a delete/reinsert

# DONE
* Add bounding sphere to OctantPoint (radius)
* Finish and test OctreePoint
* Start using OctantPoint class

from http://stackoverflow.com/questions/7067742/range-search-within-specified-radius-in-an-octree
if (pX < minX of Cell)
    dx = |px - minX|
else if (px > maxX of Cell)
    dx = |px-maxX|
Same for other dimensions

return (|dx,dy,dz|<=r)