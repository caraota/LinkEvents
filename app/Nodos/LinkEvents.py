# -*- coding: utf-8 -*-
from flask import request, session, Blueprint, json, g
from werkzeug import secure_filename

LinkEvents = Blueprint('LinkEvents', __name__)

from app.model.evento import Evento, archivo_permitido, subidas
import os
from app.model.usuario import Usuario 
from flask import send_from_directory
from flask import render_template
from app.model.evento import crear_pdf
from app.model.asiste import Asiste


@LinkEvents.route('/linkevents/ACrearUsuario', methods=['POST'])
def ACrearUsuario():
    params = request.get_json()

    results = [ {'label':'/usuario/iniciar_sesion', 'msg':[ur'El usuario fue registrado exitosamente.']}, 
                {'label':'/usuario/nuevo', 'msg':[ur'Error al crear el usuario. Verifique los valores ingresados.']}, ]

    if not('admin' in params.keys()):
        params['admin'] = False

    user = Usuario(params['data']['username'],params['data']['password'],params['data']['nombre'],params['data']['apellido'],params['admin'])

    if user.save():
        res = results[0]
    else:
        res = results[1]

    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)

@LinkEvents.route('/linkevents/VRegistrarUsuario')
def VRegistrarUsuario():
    res = {}
    if "actor" in session:
        res['actor']=session['actor']
    return json.dumps(res)
    
@LinkEvents.route('/linkevents/AIniciarSesion', methods=['POST'])
def AIniciarSesion():
    params = request.get_json()
    user = Usuario(params['username'],params['password'],"","","")

    results = [ {'label':'/VPrincipal', 'msg':[], "actor": user.username }, 
                {'label':'/usuario/iniciar_sesion', 'msg':[ur'Error al iniciar sesión. Verifique los datos ingresados.']}, ]

    if user.autenticar():
        res = results[0]
    else:
        res = results[1]

    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)

@LinkEvents.route('/linkevents/VIniciarSesion')
def VIniciarSesion():
    res = {}
    if "actor" in session:
        res['actor']=session['actor']
    return json.dumps(res)

@LinkEvents.route('/linkevents/ACrearEvento', methods=['POST'])
def ACrearEvento():
    #Access to POST/PUT fields using request.form['name']
    #Access to file fields using request.files['name']
    params = request.form.copy()
    poster = request.files.get('afiche')

    if poster != None and archivo_permitido(poster.filename):
        filename = secure_filename(poster.filename)
        poster_path = os.path.join(subidas(), filename)
        poster.save(poster_path)
        params['afiche'] = poster_path

    evento = Evento(params)

    if evento and evento.save():
        eventoid = Evento.ultimo()
        res = { 'label' : '/VEvento/'+str(eventoid), 'msg':[ur'Evento creado exitosamente'] }
    else:
        res = { 'label' : '/VCrearEvento', 'msg':[ur'Error al crear evento'] }


    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)

@LinkEvents.route('/linkevents/VPrincipal')
def VPrincipal():
    res = {}
    if "actor" in session:
        res['actor']=session['actor']
        #events = map(lambda x: x.__dict__, Event.all_owned_by(session['actor']))
        events = map(lambda x: x.__dict__, Evento.all())
    else:
        events = map(lambda x: x.__dict__, Evento.all())

    res['evento'] = events

    return json.dumps(res)


@LinkEvents.route('/linkevents/AEliminarEvento')
def AEliminarEvento():
    res = {}
    eventid = request.args.get('eventId')

    if eventid is None:
        res = {'label':'/VPrincipal', 'msg':[ur'Error al eliminar evento seleccionado.']}
    else:
        evento = Evento.get(eventid)

        if evento.eliminar():
            res = {'label':'/VPrincipal', 'msg':[ur'El evento fue eliminado exitosamente.']}
        else:
            res = {'label':'/VPrincipal', 'msg':[ur'Error al eliminar evento seleccionado.']}

    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)




















# -----------------------------------------------------------------------
@LinkEvents.route('/linkevents/ALogOutUser')
def ALogOutUser():
    #POST/PUT parameters
    params = request.get_json()
    results = [{'label':'/VIniciarSesion', 'msg':[ur'Sesión exitosamente cerrada'], "actor":None}, {'label':'/VPrincipal', 'msg':[ur'Error al cerrar sesión']}, ]
    res = results[0]
    #Action code goes here, res should be a list with a label and a message


    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)

@LinkEvents.route('/linkevents/ACancelReservation')
def ACancelReservation():
    eventid = request.args.get('eventId')
    if eventid is None:
        res = {'label':'/VShowEvent', 'msg':[ur'Error al cancelar la reserva del evento']}
    else:
        user = session.get('actor')
        if user is None:
            user = "Default"

        event      = Event.get(eventid)
        assistance = Assistance.get(user, event.eventid)

        if assistance is not None and event.update({ 'n_participants' : event.n_participants + 1 }):
            assistance.delete()
            res = {'label':'/VShowEvent', 'msg':[ur'Reserva cancelada exitosamente']}
        else:
            res = {'label':'/VShowEvent', 'msg':[ur'Error al cancelar la reserva del evento']}


    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)

@LinkEvents.route('/cargar_pdf/<filename>')
def get_file(filename):
    return send_from_directory(subidas(), filename)

@LinkEvents.route('/linkevents/ADeleteUser')
def ADeleteUser():
    #POST/PUT parameters
    params = request.get_json()
    results = [{'label':'/VListUsers', 'msg':[ur'Usuario eliminado exitosamente']}, {'label':'/VListUsers', 'msg':[ur'Error al eliminar usuario']}, ]
    res = results[0]
    #Action code goes here, res should be a list with a label and a message


    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)

@LinkEvents.route('/linkevents/AEditEvent', methods=['POST'])
def AEditEvent():
    #Access to POST/PUT fields using request.form['name']
    #Access to file fields using request.files['name']
    results = [{'label':'/VShowEvent', 'msg':[ur'El evento ha sido actualizado']}, ]
    res = results[0]
    #Action code goes here, res should be a list with a label and a message


    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)

@LinkEvents.route('/linkevents/AEvents')
def AEvents():
    #GET parameter
    results = [{'label':'/VPrincipal', 'msg':''}, ]
    res = results[0]
    #Action code goes here, res should be a list with a label and a message

    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']


    return json.dumps(res)

@LinkEvents.route('/linkevents/AGenerarCertificado')
def AGenerarCertificado():
    results = [{'label':'/VEvento', 'msg':[ur'Certificado generado']}, {'label':'/VEvento', 'msg':[ur'Error']}, ]
    eventoid = request.args.get('eventoid')

    if eventoid is None:
        res = results[1]
    else:
        evento = Evento.get(eventoid)
        usuario  = session.get('actor')
        if usuario is None:
            usuario = "Default"
        pdf = crear_pdf(render_template('certificado.html', evento=evento, usuario=usuario))
        
        if pdf is None:
            res = results[1]
        else:
            res = results[0]
            res['certificado'] = pdf

    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)

@LinkEvents.route('/linkevents/AGenerarCredencial')
def AGenerarCredencial():
    results = [{'label':'/VEvento', 'msg':[ur'Credencial generada']}, {'label':'/VEvento', 'msg':[ur'Error']}, ]
    eventoid = request.args.get('eventoid')

    if eventoid is None:
        res = results[1]
    else:
        evento = Evento.get(eventoid)
        usuario  = session.get('actor')
        if usuario is None:
            usuario = "Default"
        pdf = crear_pdf(render_template('credencial.html', evento=evento, usuario=usuario))
        
        if pdf is None:
            res = results[1]
        else:
            res = results[0]
            res['credencial'] = pdf

    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)

@LinkEvents.route('/linkevents/AReserveEvent')
def AReserveEvent():

    eventid = request.args.get('eventId')
    if eventid is None:
        res = {'label':'/VShowEvent', 'msg':[ur'Error al reservar evento']}
    else:
        user = session.get('actor')
        if user is None:
            user = "Default"

        event      = Event.get(eventid)
        assistance = Assistance.get(user, event.eventid)
        
        if assistance is None and event.update({ 'n_participants' : event.n_participants - 1 }):
            assistance = Assistance(user, event.eventid)
            if assistance.save():
                res = {'label':'/VShowEvent', 'msg':[ur'Evento reservado exitosamente']}
            else:
                res = {'label':'/VShowEvent', 'msg':[ur'Error al reservar evento']}
        else:
            res = {'label':'/VShowEvent', 'msg':[ur'Error al reservar evento']}

    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']

    print "AQUI", res
    return json.dumps(res)


@LinkEvents.route('/linkevents/AUsers')
def AUsers():
    params = request.get_json()

    results = [{'label':'/users', 'msg':[ur'Se listan los usuarios']  }, ]

    res = results[0]

    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)

@LinkEvents.route('/linkevents/AVerifyAssitance')
def AVerifyAssitance():
    #POST/PUT parameters
    params = request.get_json()
    results = [{'label':'/VListUsers', 'msg':[ur'Asistencia verificada']}, {'label':'/VListUsers', 'msg':[ur'Error al verificar asistencia']}, ]
    res = results[0]
    #Action code goes here, res should be a list with a label and a message


    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)

@LinkEvents.route('/linkevents/VEditEvent')
def VEditEvent():
    res = {}
    if "actor" in session:
        res['actor']=session['actor']
    #Action code goes here, res should be a JSON structure


    #Action code ends here
    return json.dumps(res)


@LinkEvents.route('/linkevents/VListEvents')
def VListEvents():
    res = {}
    if "actor" in session:
        res['actor']=session['actor']
        #events = map(lambda x: x.__dict__, Event.all_owned_by(session['actor']))
        events = map(lambda x: x.__dict__, Evento.all())
    else:
        events = map(lambda x: x.__dict__, Evento.all())

    res['events'] = events
 
    #Action code ends here
    return json.dumps(res)

@LinkEvents.route('/linkevents/VListUsers')
def VListUsers():

    params = request.args
    print request.args
    eventid = params.get('requestedUser')
    print eventid

    if eventid is None:
        users = User.all()
    else:
        users = User.from_event(eventid)


    res = { 'users' : users }

    if "actor" in session:
        res['actor']=session['actor']
    #Action code goes here, res should be a JSON structure


    #Action code ends here
    return json.dumps(res)

@LinkEvents.route('/linkevents/VCrearEvento')
def VCrearEvento():
    res = {}
    if "actor" in session:
        res['actor']=session['actor']
    #Action code goes here, res should be a JSON structure


    #Action code ends here
    return json.dumps(res)

@LinkEvents.route('/linkevents/VEvento')
def VEvento():

    eventoid = request.args.get('eventoid')

    res = {}
    if eventoid is not None:
        res['evento'] = Evento.get(eventoid).__dict__

    if "actor" in session:
        res['actor'] = session['actor']
        asiste   = Asiste.get(res['actor'], eventoid)
        if asiste is None:
            res['reservado'] = 1
        else:
            res['reservado'] = 0
    #Action code goes here, res should be a JSON structure

    print res

    #Action code ends here
    return json.dumps(res)

@LinkEvents.route('/linkevents/VShowUser')
def VShowUser():

    print request
    userId = request.args.get('user')

    res = {}
    if userId is not None:
        res['user'] = User.get(userId)
        res['created_event'] = User.get_created(userId)
        res['assisted_event'] = User.get_assisted(userId)

    if "actor" in session:
        res['actor']=session['actor']
    #Action code goes here, res should be a JSON structure

    #Action code ends here
    return json.dumps(res)
