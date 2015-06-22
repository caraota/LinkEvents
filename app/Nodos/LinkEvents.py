# -*- coding: utf-8 -*-
from flask import request, session, Blueprint, json, g
from werkzeug import secure_filename
from datetime import timedelta

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
    session.permanent = True
    LinkEvents.permanent_session_lifetime = timedelta(minutes=30)

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

@LinkEvents.route('/linkevents/VCrearEvento')
def VCrearEvento():
    res = {}
    if "actor" in session:
        res['actor']=session['actor']

    return json.dumps(res)

@LinkEvents.route('/linkevents/VPrincipal')
def VPrincipal():
    res = {}
    #session.permanent = True
    #LinkEvents.permanent_session_lifetime = timedelta(minutes=30)
    print session.get('actor')
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


@LinkEvents.route('/linkevents/AConfirmarAsist')
def AConfirmarAsist():
    res = {}
    eventoid = request.args.get('eventoid')
    usuario = request.args.get('username')

    if eventid is None:
        res = {'label':'/VListarParticipantes', 'msg':[ur'Error']}
    else:
        asiste = Asiste(usuario,eventoid)

        if evento.confirmarAsist():
            res = {'label':'/VListarParticipantes', 'msg':[ur'Asistencia confirmada.']}
        else:
            res = {'label':'/VListarParticipantes', 'msg':[ur'Error.']}

    #Action code ends here
    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)


@LinkEvents.route('/linkevents/AEditarEvento', methods=['POST'])
def AEditarEvento():
    #Access to POST/PUT fields using request.form['name']
    #Access to file fields using request.files['name']
    params = request.get_json()

    eventoid = params['data']['eventoid']
    fEvento =  params['data']['fEvento']

    results = [ {'label':'/VEvento/'+eventoid, 'msg':[ur'El evento fue editado exitosamente.']}, 
                {'label':'/VEditarEvento/'+eventoid, 'msg':[ur'Error al editar el evento. Verifique los valores ingresados.']}, ]
        
    res = {}

    if Evento.update(eventoid, fEvento):
        res = results[0]
    else:
        res = results[1]

    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']

    return json.dumps(res)


@LinkEvents.route('/linkevents/VEditarEvento')
def VEditarEvento():
    eventoid = request.args.get('eventoid')

    res = {}
    if eventoid is not None:
        res['evento'] = Evento.get(eventoid).__dict__

    if "actor" in session:
        res['actor'] = session['actor']

    return json.dumps(res)


@LinkEvents.route('/linkevents/AEvents')
def AEvents():
    #GET parameter
    results = [{'label':'/VPrincipal', 'msg':''}, ]
    res = results[0]

    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']

    return json.dumps(res)

@LinkEvents.route('/linkevents/VEvento')
def VEvento():

    print session.get('actor')
    eventoid = request.args.get('eventoid')

    res = {}
    if eventoid is not None:
        res['evento'] = Evento.get(eventoid).__dict__

    if "actor" in session:
        res['actor'] = session.get('actor')
        asiste = Asiste.get(res['actor'], eventoid)
        asistio = Asiste.asistio(res['actor'], eventoid)
        if asiste is None:
            res['reservado'] = 1
        else:
            res['reservado'] = 0
        if asistio is None:
            res['asistio'] = 1
        else:
            res['asistio'] = 0

    return json.dumps(res)


@LinkEvents.route('/linkevents/VListarUsuarios')
def VListarUsuarios():
    res ={}
    eventoid = request.args.get('eventoid')

    if "actor" in session:
        res['actor']=session['actor']
        usuarios = map(lambda x: x.__dict__, Asiste.all(eventoid))
    else:
        usuarios = map(lambda x: x.__dict__, Asiste.all(eventoid))

    res['usuarios'] = usuarios
 
    return json.dumps(res)





# -----------------------------------------------------------------------
# -----------------------------------------------------------------------
# -----------------------------------------------------------------------
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

@LinkEvents.route('/linkevents/AEliminarReserva')
def AEliminarReserva():
    eventoid = request.args.get('eventoid')
    if eventoid is None:
        res = {'label':'/VEvento', 'msg':[ur'Error']}
    else:
        user = session.get('actor')
        if user is None:
            user = "Default"

        evento      = Evento.get(eventoid)
        asiste = Asiste.get(user, evento.eventoid)

        if asiste is not None and evento.update({ 'capacidad' : evento.capacidad + 1 }):
            asiste.delete()
            res = {'label':'/VEvento', 'msg':[ur'Reserva eliminada']}
        else:
            res = {'label':'/VEvento', 'msg':[ur'Error']}

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

@LinkEvents.route('/linkevents/AGenerarCertificado')
def AGenerarCertificado():
    results = [{'label':'/VEvento', 'msg':[ur'Certificado generado']}, {'label':'/VEvento', 'msg':[ur'Error']}, ]
    eventoid = request.args.get('eventoid')

    print session.get('actor')
    if eventoid is None:
        res = results[1]
    else:
        evento = Evento.get(eventoid)
        usuario = session.get('actor')
        usuario = Usuario.get(usuario)
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
        usuario = session.get('actor')
        usuario = Usuario.get(usuario)
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

@LinkEvents.route('/linkevents/AReservarEvento')
def AReservarEvento():

    eventoid = request.args.get('eventoid')
    if eventoid is None:
        res = {'label':'/VEvento', 'msg':[ur'Error al reservar evento']}
    else:
        user = session.get('actor')

        if user is None:
            user = "Default"

        evento = Evento.get(eventoid)
        asiste = Asiste.get(user, evento.eventoid)
        
        if asiste is None and evento.update({ 'capacidad' : evento.capacidad-1 }):
            asiste = Asiste(user, evento.eventoid)
            if asiste.save():
                res = {'label':'/VEvento', 'msg':[ur'Evento reservado']}
            else:
                res = {'label':'/VEvento', 'msg':[ur'Error']}
        else:
            res = {'label':'/VEvento', 'msg':[ur'Error']}

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
    results = [{'label':'/VListarUsuarios', 'msg':[ur'Asistencia verificada']}, {'label':'/VListarUsuarios', 'msg':[ur'Error al verificar asistencia']}, ]
    res = results[0]
    #Action code goes here, res should be a list with a label and a message


    #Action code ends here

    if "actor" in res:
        if res['actor'] is None:
            session.pop("actor", None)
        else:
            session['actor'] = res['actor']
    return json.dumps(res)
