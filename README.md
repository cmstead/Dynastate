Dynastate
=========

A state transition system for handling behaviors that have unique data states, but can be defined with a single
transitional function. Dynastate is a data node stack with a single, definable transition behavior.  It allows for
transition from the current state forward or backward one layer in the stack or transition directly to layer N.

Dynastate is ideal for handling behaviors like breadcrumbs with a single, definable transition behavior.  Commonly
this kind of behavior can be characterized as "drillable" data. Dynastate is generic enough to be used in various
data state push/pop scenarios.
