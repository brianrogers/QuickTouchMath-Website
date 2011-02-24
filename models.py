#!/usr/bin/env python
# encoding: utf-8

from google.appengine.ext import db
#from google.appengine.tools import bulkloader

#data objects
class Player(db.Expando):
	createdate = db.DateTimeProperty(auto_now_add=True)
	playername = db.StringProperty()
	active = db.BooleanProperty()
	password = db.StringProperty()
	
class PlayerScore(db.Expando):
	createdate = db.DateTimeProperty(auto_now_add=True)
	gametype = db.StringProperty()
	highscore = db.StringProperty()
	playername = db.StringProperty()