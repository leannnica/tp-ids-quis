from flask import Flask, request, jsonify, make_response, send_from_directory, render_template, redirect, url_for
from models import db, Auto, Usuario #se pueden importar mas cosas 
import os

app = Flask(__name__, template_folder='../front/HTML', static_folder='../static')
port = 5000
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://jero:hola@localhost/tpintro' ## crear base de datos


@app.route('/', defaults = {"n_usuario" : None})
@app.route('/<n_usuario>')
def home(n_usuario):
    if not n_usuario:
        return render_template('main.html')
    if not Usuario.query.get(n_usuario):
        return render_template('main.html')
    return render_template('main.html', n_usuario = n_usuario)


@app.route('/disenar', defaults = {"n_usuario" : None})
@app.route('/disenar/<n_usuario>')
def disenar(n_usuario):
    if not n_usuario:
        return render_template('disena_auto.html')
    if not Usuario.query.get(n_usuario):
        return render_template('disena_auto.html')
    return render_template('disena_auto.html', n_usuario = n_usuario)


@app.route('/disenar/<n_usuario>/guardar-auto', methods=['POST']) 
def guardar_auto(n_usuario):
    if not Usuario.query.get(n_usuario):
        return jsonify ({"error" : "Usuario no registrado" })
    
    data = request.get_json()
    auto_nombre_repetido = Auto.query.filter_by(n_dueño = n_usuario, nombre = data.get("nombre")).first()
    if auto_nombre_repetido:
        return jsonify({'error': 'Ya tiene un auto con ese nombre'})
    else:
        auto_nuevo = Auto(n_dueño = n_usuario, color = data.get("color"), nombre = data.get("nombre"), modelo = data.get("modelo"))
        db.session.add(auto_nuevo)
        db.session.commit()
        return jsonify({'mensaje': 'Auto actualizado exitosamente'})


@app.route('/register_page')
def register_page():
    return render_template('register.html')

@app.route('/register_page/registrarse', methods=['POST']) 
def register():
    data = request.get_json()  
    usuario_existente = Usuario.query.get(data.get("usuario"))
    if usuario_existente:
        return jsonify({'error': 'Este usuario ya existe!'})
    usuario_nuevo = Usuario(n_usuario = data.get("usuario"), password = data.get("password"))
    db.session.add(usuario_nuevo)
    db.session.commit()
    return jsonify({'mensaje': 'Usuario registrado!'})

@app.route('/login_page')
def login_page():
    return render_template('inicio.html')

@app.route('/login_page/login', methods = ['POST'])
def login():
    data = request.get_json()
    usuario = Usuario.query.filter_by(n_usuario = data.get("usuario"), password = data.get("password")).first()
    if not usuario:
        return jsonify({'error': 'Credenciales inválidas'})
    return jsonify({'usuario': usuario.n_usuario})

@app.route('/cambio_contraseña')
def cambio_page():
    return render_template('cambiar_c.html')

@app.route('/cambio_contraseña/cambiar_contraseña', methods = ["PUT"])
def cambiar_contraseña():
    data = request.get_json()
    usuario = Usuario.query.get(data.get("usuario"))
    if not usuario:
        return jsonify({'error': 'Usuario no registrado'})
    elif usuario.password != data.get("password"):
        return jsonify({'error': 'Contraseña erronea'})
    else:
        usuario.password = data.get("new_password")
        db.session.commit()
        return jsonify({'mensaje': 'Contraseña actualizada'})  

@app.route('/<n_usuario>/eliminar_cuenta', methods = ["DELETE"])
def eliminar_cuenta(n_usuario):
    usuario = Usuario.query.get(n_usuario)
    if usuario:
        if usuario.garage_usuario:
            for auto in usuario.garage_usuario:
                db.session.delete(auto)
        db.session.delete(usuario)
        db.session.commit()
        return jsonify ({"mensaje" : "Cuenta eliminada"})
    else:
        return jsonify ({"error" : "Usuario no registrado"}) 


@app.route('/garage/<n_usuario>')
def garage(n_usuario):
    if Usuario.query.get(n_usuario):
        return render_template('garage.html', n_usuario = n_usuario)
    else:
        render_template('inicio.html')
    
@app.route('/garage/<n_usuario>/autos')
def autos_usuario(n_usuario):
    usuario = Usuario.query.get(n_usuario)
    if usuario:
        garage_usuario = usuario.garage_usuario
        garage_prosesado = []
        for auto in garage_usuario:
            garage_prosesado.append({
                "color" : auto.color,
                "nombre" : auto.nombre,
                "modelo" : auto.modelo
            })
        return jsonify(garage_prosesado)
    else:
        return jsonify({"error": "Usuario no registrado"})
        
    
@app.route('/garage/<n_usuario>/actualizar/<nombre_actual>', methods=['PUT'])
def actualizar_nombre_auto(n_usuario, nombre_actual):
    if not Usuario.query.get(n_usuario):
        return jsonify({"error" : "Usuario no registrado"})
    auto = Auto.query.filter_by(n_dueño=n_usuario, nombre=nombre_actual).first()
    if not auto:
        return jsonify({'error': 'Auto no encontrado'})
    data = request.get_json()
    nuevo_nombre = data.get("nuevo_nombre")
    auto_existente = Auto.query.filter_by(n_dueño=n_usuario, nombre=nuevo_nombre).first()
    if auto_existente:
        return jsonify({'error': 'Ya existe un auto con ese nombre'})
    auto.nombre = nuevo_nombre
    db.session.commit()  
    return jsonify({'mensaje': 'Nombre de auto actualizado exitosamente'})

@app.route('/garage/<n_usuario>/<n_auto>', methods = ["DELETE"]) 
def eliminar_auto(n_usuario, n_auto):
    if not Usuario.query.get(n_usuario):
        return jsonify({"error" : "Usuario no registrado"})    
    auto_a_borrar = Auto.query.filter_by(n_dueño = n_usuario, nombre = n_auto).first() 
    if  not auto_a_borrar:
        return jsonify({"error" : "Auto no existe"}) 
    else:
        db.session.delete(auto_a_borrar)
        db.session.commit()
        return jsonify({"mensaje" : "Auto eliminado"})       

@app.route('/css/<path:filename>')
def enviar_css(filename):
    css_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'front', 'css'))
    return send_from_directory(css_dir, filename)

@app.route('/javascript/<path:filename>')
def enviar_js(filename):
    js_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'front', 'java_script'))
    return send_from_directory(js_dir, filename)

@app.route('/modelos/<path:filename>')
def enviar_modelos(filename):
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'front', 'modelos'))
    return send_from_directory(models_dir, filename)

if __name__ == '__main__':
    db.init_app(app)
    with app.app_context():
        db.create_all()
    app.run(debug=True)
