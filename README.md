#facebook-calendar

A Javascript solution for Facebook's famous code challenge.

###The challenge

Given a set of events, render the events on a single day calendar (similar to Outlook, Calendar.app, and Google Calendar). There are several properties of the layout:

No events may visually overlap.
If two events collide in time, they must have the same width.
An event should utilize the maximum width available, but constraint 2) takes precedence over this constraint.
Each event is represented by a JS object with a start and end attribute. The value of these attributes is the number of minutes since 9am. So {start:30, end:90) represents an event from 9:30am to 10:30am. The events should be rendered in a container that is 620px wide (600px + 10px padding on the left/right) and 720px (the day will end at 9pm).

You may structure your code however you like, but you must implement the following function in the global namespace. The function takes in an array of events and will lay out the events according to the above description.

    function layOutDay(events) {}
    
This function will be invoked from the console for testing purposes.

###Try it out!

A live demo is available on my website [here](http://www.jayhuang.org/code/facebook/) 

If you're using Chrome, you can open developer tools (F12) and paste this in:

    layOutDay([{start: 240, end: 370}, {start: 100, end: 200}, {start: 350, end: 620}, {start: 230, end: 700}]);
    
The current layout will be replaced with the events provided.

###Copyright and license

Copyright 2013 Jay Huang under the MIT license.
