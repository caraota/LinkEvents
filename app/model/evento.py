from base import get_database
from flask import g
from xhtml2pdf import pisa
from StringIO import StringIO
import random

TABLA = "EVENTO"

SUBIDAS = './cargar_pdf/'
EXTENSIONES = set(['pdf'])

def subidas():
	return SUBIDAS

def archivo_permitido(archivo):
	return '.' in archivo and archivo.rsplit('.', 1)[1] in EXTENSIONES

def crear_pdf(datos):
	random.seed()
	nombre = './cargar_pdf/' + str(random.randint(0,1000)) + '.pdf'
	n = open(nombre, 'wb')
	try:
		pisa.CreatePDF(StringIO(datos.encode('utf-8')), n)
		print nombre
		return nombre
	except Exception as e:
		print 'Error'
		return None

class Evento:

	def __init__(self, data):
		self.nombre = data.get('nombre')
		self.descripcion = data.get('descripcion')
		self.fecha = data.get('fecha')
		self.lugar = data.get('lugar')
		self.capacidad = data.get('capacidad')
		self.afiche = data.get('afiche')
		if data.get('capacidad') != None:
			self.capacidad = int(data.get('capacidad'))
		if data.get('eventoid') != None:
			self.eventoid = int(data.get('eventoid'))

	def save(self):
		db = get_database()
		cursor = db.cursor()
		try:
			sql = 'INSERT INTO %s (eventoid, nombre, descripcion, fecha, lugar, capacidad, afiche) VALUES (NULL,"%s","%s","%s","%s","%s","%s")' % (TABLA, self.nombre, self. descripcion, self.fecha, self.lugar, self.capacidad, self.afiche)
			print "\n" + sql + "\n"
			cursor.execute(sql)			
			db.commit()
			return True
		except Exception as e:
			db.rollback()
			print e.message
			return False

	def update(self, att):
		sql = 'UPDATE %s SET ' % TABLA
		last = len(att.keys())
		for idx, attr in enumerate(att.keys()):
			sql += str(sttr) + ' = "' + str(attrs[attr]) + '"'
			if idx != last-1:
				sql += ', '
		sql += 'WHERE eventoid="' + str(self.eventid) + '"'
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

	@staticmethod
	def get(eventoid):
		sql = 'SELECT * FROM %s WHERE eventoid="%s"' % (TABLA,eventoid)
		print "\n" + sql + "\n"		
		db = get_database()
		cursor = db.cursor()
		cursor.execute(sql)
		fila = cursor.fetchone()
		if fila is None:
			return None
		else:
			data = {'eventoid':int(fila[0]),'nombre':fila[1],'descripcion':fila[2],'fecha':fila[3],'lugar':fila[4],'capacidad':int(fila[5]),'afiche':fila[6]}
			evento = Evento(data)
			return evento

	@staticmethod
	def all():
		sql = 'SELECT * FROM %s' % (TABLA)
		db = get_database()
		cursor = db.cursor()
		cursor.execute(sql)
		filas = cursor.fetchall()
		
		data = map(lambda x:{'eventoid':int(x[0]),'nombre':x[1],'descripcion':x[2],'fecha':x[3],'lugar':x[4],'capacidad':int(x[5]),'afiche':x[6]},filas)
		eventos = map(lambda x: Evento(x), data)
		
		return eventos

	@staticmethod
	def ultimo():
		sql = 'SELECT eventoid FROM %s ORDER BY eventoid DESC LIMIT 1' % (TABLA)
		print "\n" + sql + "\n"
		db = get_database()
		cursor = db.cursor()
		cursor.execute(sql)
		fila = cursor.fetchone()
		return fila[0] or None

	def eliminar(self):
		sql = 'DELETE FROM %s WHERE eventoid = %d' % (TABLA, self.eventoid)
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

