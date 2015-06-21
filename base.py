#!/usr/bin/env python

from flask import Flask, request, session, g
from flask.ext.script import Manager, Server
from random import SystemRandom
from datetime import timedelta
from contextlib import closing
import sqlite3

app = Flask(__name__, static_url_path='')
app.config.from_object('app.database.config')
manager = Manager(app)
manager.add_command("runserver", Server(
    use_debugger = True,
    use_reloader = True,
    host = 'localhost')
)

@app.before_request
def make_session_permanent():
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=45)
    session.modified = True

@app.route('/')
def root():
    return app.send_static_file('index.html')

from app.Nodos.EventPlanner import EventPlanner
app.register_blueprint(EventPlanner)

# CONEXION CON LA BASE DE DATOS
def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

def init_database():
    with closing(connect_db()) as db:
        with app.open_resource('app/database/schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

def get_database():
    db = getattr(g, 'db', None)
    if db is None:
        db = g.db = connect_db()
    return db

@app.before_request
def before_request():
    g.db = get_database()
    if g.db is None:
        print "Error conectando a la base de datos" + app.config['DATABASE']
    #print request.get_json()

@app.teardown_request
def close_dabatase_connection(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

if __name__ == '__main__':
    app.config.update(
      SECRET_KEY = repr(SystemRandom().random())
    )
    manager.run()

# END base.py
