Hey, sure. No problem.
First of all, I certainly see the value of knowing how to handle all your own dates. But that said, I would advise against it. I tried it for a project and it was horrible. Just a nightmare. The native javascript date object is an unruly beast, and it seems like a difficult task for experienced programmers, let alone us newbies.
So you should know that the built in methods Ian and I were discussing were native Python datetime.object() and a javascript library called Luxon. https://moment.github.io/luxon/
Luxon appears to be the definitive JS dateTime library. It's the revamped version of a library called Moment.js that was ubiquitous. Moment still exists as legacy code, but Luxon is the modern thing to use.
The conversation that Ian and I had was about how to store dateTime objects and pass them back and forth. I was asking about the wisdom of storing my dateTimes as strings in my database instead of a SQL dateTime object. Luxon has a method to convert dateTime into an ISO string. This is a standard dateTime format that can be converted to/from by most every language, so it's stable and universal in a sense. Plus, why I asked the question, ISO strings are written so as to be sequential by default. Meaning that anything that sorts alphabetically will correctly sort ISO dates. So if you're storing your dateTimes as strings in a flask db. You can still do a query.sort_by() against the ISO strings and they will return ordered.
With luxon the the process on the js side will look something like:
import { DateTime } from 'luxon';
const now = DateTime.local() // => this is exactly like "new Date()" but better, with built-in timezone
const stringNow = now.toISO() //=> '2021-01-18T11:32:00.000-04:00'
// Now the date is just an ISO format string that you can do what you want with.
// When you receive an ISO format string from the backend you handle it like so:
const then = DateTime.fromISO(stringNow);
And that's it really. Easy peasy.
What Ian was telling me is that this method is perfectly fine to use. But that in more complicated instances, it would be better to store the dateTime in the database as an actual SQL dateTime. He said that I would ideally be handling all the major conversions in python on the backend, and minimize how much complexity the JS side of the date handling has. For instance, you could pkg the date exactly as above, in ISO string format, and then on the backend extract it from the JSON, convert it from ISO to an actual dateTime, and then reverse the process for any GET requests or whatever.
The only last tip I have for you, is that when you look at the Luxon docs, they have a manual and a proper API reference guide. The manual is great, and really all you need to look at until you get into the weeds with luxon.



Oh, and I guess I should also add that with luxon, once you have your dateTime object declared there's a bunch of great builtin methods to use on render:
const dt = DateTime.local();
dt.toLocaleString(); //=> '4/20/2017'
dt.toLocaleString(DateTime.DATETIME_FULL); //=> 'April 20, 2017, 11:32 AM EDT'
dt.toLocaleString({ month: 'long', day: 'numeric' }); //=> 'April 20'
// you can set your own formats
DateTime.fromISO('2014-08-06T13:07:04.054').toFormat('yyyy LLL dd'); //=> '2014 Aug 06'
DateTime.local().toFormat("HH 'hours and' mm 'minutes'"); //=> '20 hours and 55 minutes'
// and you can do math !!
DateTime.local(2017, 2, 13).plus({ months: 1 }).toISODate() //=> '2017-03-13'
DateTime.local(2017, 2, 13).plus({ days: 30 }).toISODate() //=> '2017-03-15'
// comparing dates!
var d1 = DateTime.fromISO('2017-04-30');
var d2 = DateTime.fromISO('2017-04-01');
d2 < d1                                   //=> true
d2.startOf('year') < d1.startOf('year')   //=> false
d2.startOf('month') < d1.startOf('month') //=> false
d2.startOf('day') < d1.startOf('day')     //=> true
Honestly, there's so much you can do with the Luxon library. You can also handle durations and stuff. I'm just barely showing you what it does.
