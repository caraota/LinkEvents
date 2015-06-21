#!/usr/bin/env python

from flask import Flask, request, session
from flask.ext.script import Manager, Server
from random import SystemRandom
from datetime import timedelta



app = Flask(__name__, static_url_path='')
app.config.from_object('app.db.config')

manager = Manager(app)
manager.add_command("runserver", Server(
    use_debugger = True,
    use_reloader = True,
    host = 'localhost')
)

@app.before_request
def make_session_permanent():
    session.permanent              = True
    app.permanent_session_lifetime = timedelta(minutes=45)
    session.modified               = True

@app.route('/')
def root():
    return app.send_static_file('index.html')

from app.Biblioteca.EventPlanner import EventPlanner
app.register_blueprint(EventPlanner)


import sqlite3
from flask import g

# Method con connect to the database
def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

# Method to init the database
from contextlib import closing
def init_database():
    with closing(connect_db()) as db:
        with app.open_resource('app/db/schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

# Method to get a database instance
def get_database():
    db = getattr(g, 'db', None)
    if db is None:
        db = g.db = connect_db()
    return db

#Application code starts here
@app.before_request
def before_request():
    g.db = get_database()
    if g.db is None:
        print "Error connecting to database" + app.config['DATABASE']
    print request.get_json()


@app.teardown_request
def close_dabatase_connection(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()


#Application code ends here

if __name__ == '__main__':
    app.config.update(
      SECRET_KEY = repr(SystemRandom().random())
    )
    manager.run()
