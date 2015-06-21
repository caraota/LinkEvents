from base import get_database
from flask import g

TABLA = 'USUARIO'
TABLA_ASISTE = 'ASISTE'
TABLA_EVENTO = 'EVENTO'

class Usuario:

	def __init__(self, data):
		self.username = data['username']
		self.password = data['password']
		self.nombre = data['nombre']
		self.apellido = data['apellido']
		self.admin = data['admin']

	def save(self):
		db = get_database()
		cursor = db.cursor()
		try:
			sql = 'INSERT INTO %s (username, password, nombre, apellido, admin) VALUES ("%s","%s","%s","%s","%s")' % (TABLA, self.username, self.password, self.nombre, self.apellido, self.admin)
			print "\n" + sql + "\n"
			cursor.execute(sql)
			db.commit()
			return True
		except Exception as e:
			db.rollback()
			print e.message
			return False

	def exists(self):
		sql = 'SELECT username FROM %s' % TABLA
		print "\n" + sql + "\n"
		db = get_database()
		cursor = db.cursor()
		cursor.execute(sql)
		usuario = cursor.fetchone()
		return usuario and len(usuario)>0

	def autenticar(self):
		sql = 'SELECT username FROM %s WHERE username="%s" AND password="%s"' % (TABLA, self.username, self.password)
		print "\n" + sql + "\n"
		db = get_database()
		cursor = db.cursor()
		cursor.execute(sql)
		usuario = cursor.fetchone()
		return usuario and len(usuario)>0

	@staticmethod
	def get(username):
		sql = 'SELECT * FROM %s WHERE username="%s"' % (TABLA,username)
		print "\n " + sql + " \n"
		db = get_database()		
		cursor = db.cursor()
		cursor.execute(sql)
		fila = cursor.fetchone()
		if fila is None:
			return None
		else:
			data = {'username':fila[0],'password':fila[1],'nombre':fila[2],'apellido':fila[3],'admin':fila[4] }
			usuarioid = Usuario(data).__dict__
			return usuarioid

	@staticmethod
	def all():
		sql = 'SELECT username FROM %s' % (TABLENAME)
		print "\n" + sql + "\n"
		db = get_database()		
		cursor = db.cursor()
		cursor.execute(sql)
		usuarios = cursor.fetchall()
		usuarios = map(lambda x: x[0], usuarios)
		return usuarios

	@staticmethod
	def asistencias(username):
		sql = 'SELECT evento FROM %s WHERE participante="%s"' % (TABLA_ASISTE,username)
		print "\n" + sql + "\n"
		db = get_database()		
		cursor = db.cursor()
		curs = db.cursor()
		cursor.execute(sql)
		data = []
		fila = cursor.fetchone()
		if fila is None:
			return None
		while (fila<>None):
			sql = 'SELECT nombre FROM %s WHERE eventid="%s"' % (TABLA_EVENTO,fila[0])
			curs.execute(sql)
			nombre = curs.fetchone()
			data.append((nombre[0],fila[0]))
			fila = cursor.fetchone()
		return data

	@staticmethod
	def reservas(evento):
		sql = 'SELECT participante FROM %s WHERE event="%s"' % (TABLA_ASISTE, evento)
		print "\n" + sql + "\n"
		db = get_database()		
		cursor = db.cursor()
		cursor.execute(sql)
		usuarios = cursor.fetchall()
		usuarios = map(lambda x: x[0], usuarios)
		return usuarios