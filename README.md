Gabriel Lewington's Virtual Pet coursework submission

Aim of the game is simply to manage the bugs of your Hive, starting with your Queen which can make more.

Players start with a Queen and a food storage building. This building (like all buildings) needs to be constructed to be used.
Once it has, the player can command the Queen to collect food from Food Sources (large leaves) from around the map.
Once there is food inside the storage, the bugs can be told to drain the storage to feed themselves and prolong their lives.

Bugs have activities/jobs they can perform:
- Harvesting food from a Food Source and transporting it into a Food Storage building,
- Find the closest Food Storage to feed from,
- Find and enter the closest Sleeping Den building to rest in and increase their sleep stat,
- Aid in the construction of a building. The more bugs doing this to a specific building, the faster it constructs,
- Clean away corpses left behind by dead bugs. The amount of corpses in the game affects the decay of the cleanliness stat of all bugs.

Bugs have four stats:
- Hunger: This is the main stat that results in the bug's death. If the bug is neglected or the player does not harvest,
- Cleanliness: When this stat hits 0 the bug dies. The more corpses in the game determines the amount of cleanliness gained every tick. When there are few corpses cleanliness is positive, when there is many it starts going down,
- Sleep: This stat affects the movement speed of bugs and therefore their productivity. When it hits 0 the bug falls asleep on the floor. However sending the bug to a Sleeping Den doubles the rate the sleep stat increases. So construct some of those near a bug's journey,
- Happiness: This stat does nothing, but is a representation of the average state of a bug.

Bugs will tell the player if they are low on the first three stats by an image above their head, represent any of the three main stats.

Buildings can be created using the two buttons on the top left of the screen.
- It is optimal to build Sleeping Dens near a group of bug's route/journey from Food Storage to Source so that the bugs can get sleep at a moments notice.
- It is optimal to build Food Storages as close to a Food Source as possible as to limit the distance and therefore increase the speed of harvesting. (I couldn't think of a way to stop the player just putting the storage right next to the Food Source, and didn't have the time)

The Save and Exit button on the bottom left of the screen will save the entire state of the game via http POST to the server.
This save can be loaded back up from the homepage (if the server didn't shut down).


Unfinished and Future Work:
- I had plans for a Clash of Clans style spectator multiplayer, where over players without access to a Hive could still see how its doing and its size.
- I wished to get rid of my reliance on alerts but didn't find the time to replace them with html elements that would hide and reveal themselves.
- Performance on my laptop isn't great. When going into Chrome's performance tab it says 80% of time is spent on painting. But my canvas calls are as miminal as possible bar not rendering things outside the view.
- I couldn't get PUT to work with my hours of trying, so saving a game that was loaded from the homepage just makes a copy with the exact same name.
- Animation. I didn't focus on it as this isn't an art degree and the code is very simple. Have a timer that goes up and when it hits a certain amount just set the image to the next image in an array of frames. Loop that around when it gets to the end.


Informal Comments about the submission:
I feel like this piece of work shows I'm a good programmer, problem solver and game designer, but not a good web developer. The CSS is lacking and I found HTML to be confusing and not straight-forward to layout what I wanted.
If I made an actual website with more focus on the layout and standards of webpages on the internet I'd come out of this with a better understanding of those aspects.
But I didn't really come here to become a Web Designer anyway, I just hope my mark doesn't tank because of it.

