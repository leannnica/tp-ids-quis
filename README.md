                                      Proyecto de Diseño de Autos
                                      
Este proyecto es una aplicación web que permite a los usuarios diseñar sus propios autos, seleccionar modelos y colores, y guardar sus diseños en una base de datos. Además, los usuarios pueden ver sus diseños guardados en un garaje personal.

Descripción del Proyecto
El proyecto se compone de varias páginas HTML que permiten a los usuarios interactuar con la aplicación de las siguientes maneras:

**Requisitos de Inicio de Sesión
Es obligatorio que los usuarios inicien sesión para poder crear y guardar un diseño de auto. Si no han iniciado sesión, serán redirigidos a la página de inicio de sesión.**

Página de Bienvenida: Es la página principal de la aplicación. Los usuarios pueden iniciar sesión desde una barra lateral desplegable ubicada en la derecha de la pantalla.
![image](https://github.com/user-attachments/assets/52d2d270-2554-48bd-8327-0553592b6e5f)


Diseño de Autos: Después de iniciar sesión, los usuarios pueden diseñar sus autos tocando el botón "Diseña tu auto", lo que los redirige a una página donde pueden:

*Seleccionar entre tres modelos de autos.
*Elegir el color deseado para el auto.
*Asignar un nombre al modelo de auto creado.
*Guardar el diseño en la base de datos.
*Garaje: Los usuarios pueden acceder a su garaje desde un botón en la página principal o al lado del botón de guardar diseño en la    página de diseño. 

En el garaje, se muestra:

El nombre de inicio de sesión.
El nombre del diseño del auto.
El modelo del auto seleccionado con su respectivo color.
Un botón para eliminar cualquier creación.
Un boton para volver a la pagina anterior.

-----------------------------------------------------------------------------------------------------------------------------------------

Uso : 
Abre tu navegador y navega a http://localhost:5000 para acceder a la página de bienvenida.
Usa la barra lateral desplegable en la derecha para iniciar sesión.
Diseña tu auto y guárdalo en la base de datos.
Accede a tu garaje para ver tus diseños guardados.

-----------------------------------------------------------------------------------------------------------------------------------------

Instalación:
Sigue estos pasos para configurar el proyecto en tu máquina local:

Clona este repositorio: git clone git@github.com:jeroPC/trabajointroduccion.git

Navega al directorio del proyecto: cd trabajointroduccion/proyecto/back

Crea y activa un entorno virtual:
*python -m venv venv
*source venv/bin/activate <----linux #  # En Windows usa `venv\Scripts\activate`


Instala las dependencias necesarias:
pip install -r requirements.txt
Configura la base de datos en config.py con tus credenciales de PostgreSQL.

Corre el servidor: python3 app.py

-----------------------------------------------------------------------------------------------------------------------------------------

Tecnologías Utilizadas:

Flask: Para el backend y la gestión de rutas.
SQLAlchemy: Para la gestión de la base de datos.
HTML/CSS/JavaScript: Para el frontend y la interacción con el usuario.
Postgre: Para gestionar la base de datos.

-----------------------------------------------------------------------------------------------------------------------------------------
