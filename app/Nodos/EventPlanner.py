# -*- coding: utf-8 -*-
from flask import request, session, Blueprint, json, g

from werkzeug import secure_filename

EventPlanner = Blueprint('EventPlanner', __name__)


@EventPlanner.route('/eventplanner/ACancelReservation')
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


from app.model.evento import Evento, archivo_permitido, subidas
import os
@EventPlanner.route('/eventplanner/ACreateEvent', methods=['POST'])
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

from flask import send_from_directory

@EventPlanner.route('/cargar_pdf/<filename>')
def get_file(filename):
    return send_from_directory(upload_folder(), filename)

from app.model.usuario import Usuario 

@EventPlanner.route('/eventplanner/ACreateUser', methods=['POST'])
def ACreateUser():
    #POST/PUT parameters
    params = request.get_json()

    results = [ {'label':'/user/login', 'msg':[ur'Usuario registrado exitosamente']}, 
                {'label':'/user/new', 'msg':[ur'Error al crear usuario']}, ]


    user = User(params['data'])
    if user.save():
        res = results[0]
    else:
        res = results[1]
    #Action code goes here, res should be a list with a label and a message


    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)



@EventPlanner.route('/eventplanner/ADeleteEvent')
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



@EventPlanner.route('/eventplanner/ADeleteUser')
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



@EventPlanner.route('/eventplanner/AEditEvent', methods=['POST'])
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



@EventPlanner.route('/eventplanner/AEvents')
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

from flask import render_template
from app.model.evento import crear_pdf
@EventPlanner.route('/eventplanner/AGenerateCertificate')
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



@EventPlanner.route('/eventplanner/AGenerateCredentials')
def AGenerateCredentials():
    #POST/PUT parameters

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



@EventPlanner.route('/eventplanner/ALogOutUser')
def ALogOutUser():
    #POST/PUT parameters
    params = request.get_json()
    results = [{'label':'/VLoginUser', 'msg':[ur'Sesión exitosamente cerrada'], "actor":None}, {'label':'/VHome', 'msg':[ur'Error al cerrar sesión']}, ]
    res = results[0]
    #Action code goes here, res should be a list with a label and a message


    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)



@EventPlanner.route('/eventplanner/ALoginUser', methods=['POST'])
def ALoginUser():
    #POST/PUT parameters
    params = request.get_json()

    user = User(params)

    results = [ {'label':'/VHome', 'msg':[], "actor": user.user }, 
                {'label':'/user/login', 'msg':[ur'Error al iniciar sesión']}, ]


    if user.authenticate():
        res = results[0]
    else:
        res = results[1]


    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)



from app.model.asiste import Asiste
@EventPlanner.route('/eventplanner/AReserveEvent')
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


    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']

    print "AQUI", res
    return json.dumps(res)



@EventPlanner.route('/eventplanner/AUsers')
def AUsers():
    #POST/PUT parameters
    params = request.get_json()

    results = [{'label':'/users', 'msg':[ur'Se listan los usuarios']  }, ]



    res = results[0]
    #print "ANDREA", res


    #Action code goes here, res should be a list with a label and a message


    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)



@EventPlanner.route('/eventplanner/AVerifyAssitance')
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



@EventPlanner.route('/eventplanner/VCertificate')
def VCertificate():

    res = {}
    if "actor" in session:
        res['actor']=session['actor']
    #Action code goes here, res should be a JSON structure


    #Action code ends here
    return json.dumps(res)



@EventPlanner.route('/eventplanner/VCredential')
def VCredential():
    res = {}
    if "actor" in session:
        res['actor']=session['actor']
    #Action code goes here, res should be a JSON structure


    #Action code ends here
    return json.dumps(res)



@EventPlanner.route('/eventplanner/VEditEvent')
def VEditEvent():
    res = {}
    if "actor" in session:
        res['actor']=session['actor']
    #Action code goes here, res should be a JSON structure


    #Action code ends here
    return json.dumps(res)



@EventPlanner.route('/eventplanner/VHome')
def VHome():
    res = {}
    if "actor" in session:
        res['actor']=session['actor']
    #Action code goes here, res should be a JSON structure

    #Action code ends here
    return json.dumps(res)



@EventPlanner.route('/eventplanner/VListEvents')
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



@EventPlanner.route('/eventplanner/VListUsers')
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



@EventPlanner.route('/eventplanner/VLoginUser')
def VLoginUser():
    res = {}
    if "actor" in session:
        res['actor']=session['actor']
    #Action code goes here, res should be a JSON structure


    #Action code ends here
    return json.dumps(res)



@EventPlanner.route('/eventplanner/VRegisterEvent')
def VRegisterEvent():
    res = {}
    if "actor" in session:
        res['actor']=session['actor']
    #Action code goes here, res should be a JSON structure


    #Action code ends here
    return json.dumps(res)



@EventPlanner.route('/eventplanner/VRegisterUser')
def VRegisterUser():
    res = {}
    if "actor" in session:
        res['actor']=session['actor']
    #Action code goes here, res should be a JSON structure


    #Action code ends here
    return json.dumps(res)



@EventPlanner.route('/eventplanner/VShowEvent')
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

@EventPlanner.route('/eventplanner/VShowUser')
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

#Use case code starts here


#Use case code ends here
