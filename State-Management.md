# State Management

There need to be two State Managers,
1. For front end, the `FrontEndStateManager`
2. For back end, the `BackEndStateManager`

Both of these, will then interact, via
a signal provided by the Front End that will then force a Back End
state change.


## Front-End State manager

The Components in the front end
1. Navbar
   1. Action Buttons
      1. Previous Button
      2. Start Button
      3. Stop Button
   2. Folder
      1. File's
         1. Ts File  - contains algorithms
         2. Io File  - contains the addable nodes
         3. Bat File - contains the mazes
         4. Sys File - contains the speeds
         5. Gui File - contains the legend
         6. `Settings.md` File - contains settings
2. Hex Board
    1. Hex
        1. Start Hex
        2. End Hex
        3. Bomb Hex
        4. Wall Node
        5. Normal Node
        6. Weight Node
        7. Visited Node
        8. Path Nod

## Components

### Buttons
#### Behaviour
1. The Start Button should be grayed out unless
there is an algorithm + start Node + end Node, if
any of these are absent then, we should give the usr
a meaningful prompt.
2. The Clear All Button should never be grayed out
and should work always, it should reset the whole
board to **INFANT STATE**.
3. Previous is fine the way it is, but it should be just
removing the path + node colors and keeping everything
else the same.

#### Design
Have one global button component, with the following properties

1. Icon
2. isActive ?= condition (default = true)
3. onClick = call back function that is triggered when clicked.

`SyncGraph` behaviour specification :
It takes in a Map of `Node IDs` and `Node Types`
And then based on the types, it is either a Wall or Weight, and then we need to change
the nodes in the BackendStateManager.