#!/usr/bin/env python

import cgi
import os
import logging

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp import template
from google.appengine.ext import db
import base64
import hmac
import sha

from models import *

class SignInForm(webapp.RequestHandler):
	def get(self):
		template_values = {'filename':'testfile'
							,'YOUR_AWS_ACCESS_KEY':'1J0SCPES3BY4DWSAM0R2'
							}
		
		path = os.path.join(os.path.dirname(__file__),'templates/signin.html')
		self.response.out.write(template.render(path,template_values))
		
class SignInAction(webapp.RequestHandler):
	def post(self):
		authed = 'False'
		playername = self.request.get('playername')
		password = self.request.get('password')
		#check basic authentication
		pq = Player.all()
		pq.filter("playername =", playername.lower())
		results = pq.fetch(1)
		if(pq.count(1)>0):
			for p in results:
				if(p.password == password):
					authed = str(p.key())
				else:
					authed = 'False'
		self.response.out.write("<auth>"+authed+"</auth>")
		
		
class NewPlayerForm(webapp.RequestHandler):
	def get(self):
		template_values = {'filename':'testfile'
							,'YOUR_AWS_ACCESS_KEY':'1J0SCPES3BY4DWSAM0R2'
							}

		path = os.path.join(os.path.dirname(__file__),'templates/newplayer.html')
		self.response.out.write(template.render(path,template_values))

class NewPlayerAction(webapp.RequestHandler):
	def post(self):
		playername = self.request.get('playername')
		password = self.request.get('password')
		#create new player in the model
		pq = Player.all()
		pq.filter("playername =", playername.lower())
		results = pq.fetch(1)
		if(pq.count(1)==0):
			p = Player()
			p.playername = playername.lower()
			p.password = password
			p.put()
			self.response.out.write("<key>" + str(p.key()) + "</key>")
		else:
			self.response.out.write("<key>false</key>")
		

class CheckPlayerAction(webapp.RequestHandler):
	def post(self):
		playername = self.request.get('playername')
		#check if name is available
		pq = Player.all()
		pq.filter("playername =", playername.lower())
		results = pq.fetch(1)
		if(pq.count(1)>0):
			self.response.out.write("<result>true</result>")
		else:
			self.response.out.write("<result>false</result>")	

class PlayGame(webapp.RequestHandler):
	def get(self,player=0):
		# get the player
		p = Player.all()
		p.filter('__key__ = ',db.Key(player));
		results = p.fetch(1)

		for plr in results:
			playername = plr.playername
			#get the scores
			scores = PlayerScore.all()
			scores.filter('playername = ', playername.lower())
			if(scores.count(1)<1):
				#scores don't exist yet
				addscore = PlayerScore()
				addscore.gametype = 'add'
				addscore.highscore = '0'
				addscore.playername = playername
				addscore.put()
				add_score = '0'
				
				subscore = PlayerScore()
				subscore.gametype = 'sub'
				subscore.highscore = '0'
				subscore.playername = playername
				subscore.put()
				sub_score = '0'
				
				mulscore = PlayerScore()
				mulscore.gametype = 'mul'
				mulscore.highscore = '0'
				mulscore.playername = playername
				mulscore.put()
				mul_score = '0'
				
				divscore = PlayerScore()
				divscore.gametype = 'div'
				divscore.highscore = '0'
				divscore.playername = playername
				divscore.put()
				div_score = '0'
			else:
				allscores = scores.fetch(4)
				for s in allscores:
					if(s.gametype == 'add'):
						add_score = s.highscore
						s.topscore = int(s.highscore)
						s.put()
					if(s.gametype == 'sub'):
						sub_score = s.highscore
						s.topscore = int(s.highscore)
						s.put()
					if(s.gametype == 'mul'):
						mul_score = s.highscore
						s.topscore = int(s.highscore)
						s.put()
					if(s.gametype == 'div'):
						div_score = s.highscore
						s.topscore = int(s.highscore)
						s.put()
			
		template_values = {'player':playername
							,'add_score':add_score
							,'sub_score':sub_score
							,'mul_score':mul_score
							,'div_score':div_score
							}

		path = os.path.join(os.path.dirname(__file__),'templates/gameparts/qtm-game.html')
		self.response.out.write(template.render(path,template_values))
		
class SavePlayerScore(webapp.RequestHandler):
	def post(self):
		playername = self.request.get('playername')
		playerscore = self.request.get('score')
		gametype = self.request.get('type')
		logging.info(playername)
		logging.info(playerscore)
		logging.info(gametype)		
		#check if name is available
		scores = PlayerScore.all()
		scores.filter("playername =", playername.lower())
		results = scores.fetch(4)
		for s in results:
			logging.info(s.gametype)
			logging.info(gametype)
			if(s.gametype == gametype):
				logging.info(s.highscore)
				if(int(s.highscore) < int(playerscore)):
					logging.info('saving new score')
					s.highscore = playerscore
					s.topscore = int(playerscore)
					s.put()
				
class TopScores(webapp.RequestHandler):
	def get(self,gametype):
		#gametype = self.request.get('type')
		if gametype == 'add':
			longgametype = 'Addition'
		if gametype == 'sub':
			longgametype = 'Subtraction' 
		if gametype == 'mul':
			longgametype = 'Multiplication'
		if gametype == 'div':
			longgametype = 'Division'
		
		scorelist = "";
		#get the scores
		#scores = PlayerScore.all()
		#scores.filter('gametype = ', gametype)
		#scores.order('highscore')
		q = db.GqlQuery("SELECT * FROM PlayerScore " +
		                "WHERE gametype = :1 " +
		                "ORDER BY topscore DESC",
		                gametype)
		results = q.fetch(20)
		for s in results:
			logging.info(s.highscore)
			logging.info(s.playername)
			scorelist += s.highscore + ' - ' + s.playername + '<br>'
			
		template_values = {'scorelist':scorelist,
							'gametype':gametype,
							'longgametype':longgametype}

		path = os.path.join(os.path.dirname(__file__),'templates/gameparts/highscores.html')
		self.response.out.write(template.render(path,template_values))