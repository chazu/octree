# TODO
* Query for points in sphere

* Write method for getting depth of octree
* Allow tuning of splitting rules (multiple points per octant)
* Refactor insertion to allow for non-leaf nodes to contain points which intersect with more than one child octant

* Check for collision on insertion/reinsertion [resinsertion being deletion and then insertion]
* Speed test for large octree (size of solar system)
* Test deferred insertion
* Nearest neighbor search
* Query for points in conic frustrum (lol wat)
 - Assuming that reinsertion will be just a delete/reinsert

# DONE
* Add bounding sphere to OctantPoint (radius)
* Finish and test OctreePoint
* Start using OctantPoint class
* Write method to collect points
* Add deferred insertion
* Add sphere intersection detection for points in octants
* Method to see if more than one octree contains point when inserting
* Refactor _insert for clarity
* Fix stack overflow for identical points