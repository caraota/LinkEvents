#!/usr/bin/env python

from base import get_database
from flask import g

TABLA = "ASISTE"

class Asiste:

	def __init__(self, usuario, evento):
		self.usuario = usuario
		self.evento = evento

	def save(self):
		db = get_database()
		cursor = db.cursor()
		try:
			sql = 'INSERT INTO %s (participante, evento, asistio) VALUES ("%s", "%s", 0)' % (TABLA, self.usuario, self.evento)
			cursor.execute(sql)
			db.commit()
			return True
		except Exception as e:
			db.rollback()
			print e.message
			return False

	def delete(self):
		sql = 'DELETE FROM %s WHERE participante="%s" AND evento="%s"' % (TABLA, self.usuario, self.evento)
		try:
			db = get_database()
			cursor = db.cursor()
			cursor.execute(sql)
			db.commit()
			return True
		except Exception as e:
			db.rollback()
			print e.message
			return False

	@staticmethod
	def get(usuario, evento):
		sql = 'SELECT * FROM %s WHERE participante="%s" AND evento="%s"' % (TABLA, usuario, evento)
		db = get_database()
		cursor = db.cursor()
		cursor.execute(sql)
		fila = cursor.fetchone()
		if fila is None:
			return None
		else:
			asiste = Asiste(fila[0], int(fila[1]))
			return asiste

	@staticmethod
	def all(evento):
		sql = 'SELECT U.username, U.password, U.nombre, U.apellido, U.admin FROM ASISTE A, USUARIO U WHERE evento = "%s" AND A.participante = U.username' % (evento)
		db = get_database()
		cursor = db.cursor()
		cursor.execute(sql)
		filas = cursor.fetchall()

		data = map(lambda x:{'username':x[0],'password':x[1],'nombre':x[2],'apellido':x[3],'admin':x[4]},filas)
		usuarios = map(lambda x: Asiste(x), data)

		return usuarios
		
	@staticmethod
	def asistio(usuario, evento):
		sql = 'SELECT * FROM %s WHERE participante="%s" AND evento="%s" AND asistio=1' % (TABLA, usuario, evento)
		print "\n" + sql + "\n"
		db = get_database()
		cursor = db.cursor()
		cursor.execute(sql)
		fila = cursor.fetchone()
		if fila is None:
			return None
		else:
			asiste = Asiste(fila[0], int(fila[1]))
			return asiste			

	@staticmethod
	def confirmarAsistencia(usuario,evento):
		sql = 'UPDATE %s SET asistio=1 WHERE participante="%s" AND evento="%s"' % (TABLA,usuario,evento)
		print "\n" + sql + "\n"
		db = get_database()
		cursor = db.cursor()
		try:
			cursor.execute(sql)
			db.commit()
			return True
		except Exception as e:
			db.rollback()
			print e.message
			return False

class Listar:

	def __init__(self,data): 
 		self.usuario = data.get('username')
 		self.password = data.get('password')
 		self.nombre = data.get('nombre')
 		self.apellido = data.get('apellido')
 		self.admin = data.get('admin')
 		self.asistio = data.get('asistio')

	@staticmethod
	def all(evento):
		sql = 'SELECT U.username, U.password, U.nombre, U.apellido, U.admin, A.asistio FROM ASISTE A, USUARIO U WHERE evento = "%s" AND A.participante = U.username' % (evento)
		db = get_database()
		cursor = db.cursor()
		cursor.execute(sql)
		filas = cursor.fetchall()

		data = map(lambda x:{'username':x[0],'password':x[1],'nombre':x[2],'apellido':x[3],'admin':x[4],'asistio':x[5]},filas)

		usuarios = map(lambda x: Listar(x), data)

		return usuarios

# END asiste.py
