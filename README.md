# Capstone Back End

Visit the live website here:

https://capstone-tabletop.herokuapp.com

## A note from the developer

My focus is front end development with React, but it was important to me to know how to build a fully functional JWT authorization server. I got a little carried away.

It works well and is fairly clean and well organized.

I've included env.text in case anyone ever wanted to play with this sucker. You would have to be crazy.

## Brief Guide

index.js is the entry point for the application and is fairly well commented

routes/ contains the scripts setting up the router objects used by the express app

end-ware/ contains the final scripts used by each route, which I'm calling "end-ware", as opposed to middleware

harperDB/ contains the calls to HarperDB

utils/protected.js contains middleware for express user authorization

utils/authorize-socket.js contains middleware for socket user authorization

utils/email.js contains the scripts and configurations for using nodemailer

utils/tokens.js contains functions for generating and sending JWT

## Known Bug

It is an elusive bug. It only happens once in a blue moon, maybe 3 or 4 times over the course of development. Sometimes an entire table in my database will become inaccessible, behaving as though there were multiple records with the same record ID (primary key). I am not sure how this could happen as the record ID is set _by the database_ when a new record is created, and I only provide an ID when reading, updating, deleting. Anyway, I need to reach out to HarperDB about it, I just haven't gotten around to it yet. I'm not the expert on this and am probably missing something obvious.
