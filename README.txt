#Instrucciones para ejecutar esta aplicación bajo Linux 
#(para otros sistemas , por favor consultar la documentación de Flask)
#Necesitará tener instalados python-setuptools y python-virtualenv
#Si no los tiene instalados, puede hacerlo ejecutando los comandos
sudo apt-get install python-setuptools
sudo apt-get install python-virtualenv

#Crear una carpeta aplicaciones

mkdir aplicaciones

#En una ventana de comandos cambiar a la carpeta principal de la aplicación.

cd aplicaciones

#Instalar Easy setup

wget https://bootstrap.pypa.io/ez_setup.py -O - | python - --user

#Instalar un ambiente virtual

easy_install virtualenv

#Crear en aplicaciones la carpeta EventPlannerFL y moverse a la nueva carpeta.

mkdir EventPlanner
cd EventPlanner

Copiar allí el archivo comprimido generado por cohesión y  descomprimirlo.

unzip EventPlannerFL.zip

#Crear un ambiente virtual

virtualenv venv

#Activar el ambiente virtual

source venv/bin/activate

#Instalar Flask

pip install flask

#instalar la gestión de opciones del servidor web

pip install flask-script

#Ejecutar la aplicación

python base.py runserver

#El servidor quedará ejecutando indefinidamente.
#Puede abrir en un navegador la dirección
# http://127.0.0.1:5000/ para entrar en la aplicación.

#Para detener el servidor 
#escribir Ctrl-c en la cónsola en la que ejecuta el servidor.

#Cuando la aplicación ya está instalada y se quiere descargar de 
#cohesión una nueva versión puede hacerlo con los pasos siguientes.
#Respaldar la versión anterior

tar czvf ../DiseñoAplicaciónEventosFl`date +%y%m%d%H%M%S`.tgz {static,base.py,app,README.txt}

#borrar la versión ya respaldada

rm -rf {static,base.py,app,README.txt}

#Descargar una nueva versión desde cohesión y 
#desempaquetarla en la carpeta de la aplicación

unzip EventPlannerFL.zip

#Ejecutar la aplicación

python base.py runserver