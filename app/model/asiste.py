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
			asiste = Asiste(row[0], int(row[1]))
			return asiste
