Lab
=====

(Note: this is not complete yet)

A (JavaScript) simulator for physics and mathematics and whatever else that works!

There is the `Engine`, and other visualisation tools, e.g. `EventEmitter`,
`Logger`.

The Engine
------------

This spawns a web worker, which consists of three parts:

 1. A system - basically just a function which returns some value
    e.g. acceration, for the current or given state of the system.

 2. A solver - computes the changes of the system's states given the value
    from the system.

 3. A stepper - put any corrections to the changes and advances the state's
    time forward, bringing the new changes.

