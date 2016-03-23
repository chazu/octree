# TODO

* Query for points in sphere

* Disallow or flag insertion of points which would collide with other points (considering radius)
* implement reinsert method which handles collisions as events to be sent to the client (game) - these represent collisions between moving objects in the game space, therefore have relevance to the game state. First insertions are assumed to be required to not cause collisions.

* Check for collision on insertion/reinsertion [resinsertion being deletion and then insertion]

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
* Allow tuning of splitting rules (multiple points per octant)
* Write method for getting depth of octree
* Test that splitting occurs properly (via #depth)
* Test that nonstandard breakpoints work (via #depth)
* Write method for whether child octant can contain sphere
* Ensure that point radius is taken into account when splitting/inserting
* Refactor insertion so that non-leaf nodes contain points which intersect with more than one child octant (see above)
* collectPoints should include own points as well as childrens'
* Speed test for large octree (size of solar system)
