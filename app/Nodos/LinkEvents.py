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

    results = [ {'label':'/VHome', 'msg':[], "actor": user.username }, 
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




# -----------------------------------------------------------------------



@LinkEvents.route('/linkevents/ALogOutUser')
def ALogOutUser():
    #POST/PUT parameters
    params = request.get_json()
    results = [{'label':'/VIniciarSesion', 'msg':[ur'Sesión exitosamente cerrada'], "actor":None}, {'label':'/VHome', 'msg':[ur'Error al cerrar sesión']}, ]
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


@LinkEvents.route('/linkevents/ACreateEvent', methods=['POST'])
def ACreateEvent():
    #Access to POST/PUT fields using request.form['name']
    #Access to file fields using request.files['name']
    params = request.form.copy()
    poster = request.files.get('poster')

    if poster != None and archivo_permitido(poster.filename):
        filename = secure_filename(poster.filename)
        poster_path = os.path.join(subidas(), filename)
        poster.save(poster_path)
        params['poster_path'] = poster_path

    if "actor" in session:
        params['owner'] = session['actor']

    event = Event(params)

    if event and event.save():
        eventid = Event.last_id()
        res = { 'label' : '/event/'+str(eventid), 'msg':[ur'Evento creado exitosamente'] }
    else:
        res = { 'label' : '/events/new', 'msg':[ur'Error al crear evento'] }


    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)

@LinkEvents.route('/cargar_pdf/<filename>')
def get_file(filename):
    return send_from_directory(upload_folder(), filename)

@LinkEvents.route('/linkevents/ADeleteEvent')
def ADeleteEvent():
    #POST/PUT parameters
    params = request.get_json()
    results = [{'label':'/VListEvents', 'msg':[ur'Evento eliminado exitosamente']}, {'label':'/VListEvents', 'msg':[ur'Error al eliminar evento']}, ]
    res = results[0]
    #Action code goes here, res should be a list with a label and a message


    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)

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
    results = [{'label':'/events', 'msg':[ur'Se listan los eventos']}, ]
    res = results[0]
    #Action code goes here, res should be a list with a label and a message

    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']


    return json.dumps(res)

@LinkEvents.route('/linkevents/AGenerateCertificate')
def AGenerateCertificate():
    results = [{'label':'/VShowEvent', 'msg':[ur'Certificado exitosamente generado']}, {'label':'/VShowEvent', 'msg':[ur'Error al generar certificado']}, ]
    eventid = request.args.get('eventId')

    if eventid is None:
        res = results[1]
    else:

        event = Event.get(eventid)
        user  = session.get('actor')
        if user is None:
            user = "Default"
        pdf = create_pdf(render_template('certificate.html', event=event, user=user))
        
        if pdf is None:
            res = results[1]
        else:
            res = results[0]
            res['certificate'] = pdf

    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)

@LinkEvents.route('/linkevents/AGenerateCredentials')
def AGenerateCredentials():
    results = [{'label':'/VShowEvent', 'msg':[ur'Credenciales exitosamente generadas']}, {'label':'/VShowEvent', 'msg':[ur'Error al generar credenciales']}, ]
    eventid = request.args.get('eventId')

    if eventid is None:
        res = results[1]
    else:
        event = Event.get(eventid)
        user  = session.get('actor')
        if user is None:
            user = "Default"
        pdf = create_pdf(render_template('credentials.html', event=event, user=user))
        
        if pdf is None:
            res = results[1]
        else:
            res = results[0]
            res['credentials'] = pdf

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

@LinkEvents.route('/linkevents/VCertificate')
def VCertificate():

    res = {}
    if "actor" in session:
        res['actor']=session['actor']
    #Action code goes here, res should be a JSON structure


    #Action code ends here
    return json.dumps(res)

@LinkEvents.route('/linkevents/VCredential')
def VCredential():
    res = {}
    if "actor" in session:
        res['actor']=session['actor']
    #Action code goes here, res should be a JSON structure


    #Action code ends here
    return json.dumps(res)

@LinkEvents.route('/linkevents/VEditEvent')
def VEditEvent():
    res = {}
    if "actor" in session:
        res['actor']=session['actor']
    #Action code goes here, res should be a JSON structure


    #Action code ends here
    return json.dumps(res)

@LinkEvents.route('/linkevents/VHome')
def VHome():
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
        events = map(lambda x: x.__dict__, Event.all())
    else:
        events = map(lambda x: x.__dict__, Event.all())

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

@LinkEvents.route('/linkevents/VRegisterEvent')
def VRegisterEvent():
    res = {}
    if "actor" in session:
        res['actor']=session['actor']
    #Action code goes here, res should be a JSON structure


    #Action code ends here
    return json.dumps(res)

@LinkEvents.route('/linkevents/VShowEvent')
def VShowEvent():

    eventid = request.args.get('eventId')

    res = {}
    if eventid is not None:
        res['event'] = Event.get(eventid).__dict__

    if "actor" in session:
        res['actor'] = session['actor']
        assistance   = Assistance.get(res['actor'], eventid)
        if assistance is None:
            res['reserved'] = 1
        else:
            res['reserved'] = 0
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