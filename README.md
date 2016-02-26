# TODO
* Query for points in sphere [IN PROGRESS]
** Write additional tests/refactor (see TODOs in test/class)
* Write method for getting depth of octree
* Write method to collect points
* Allow tuning of splitting rules (multiple points per octant
* Speed test for large octree (size of solar system)
* Add deferred insertion
* Nearest neighbor search

* Query for points in conic frustrum
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
