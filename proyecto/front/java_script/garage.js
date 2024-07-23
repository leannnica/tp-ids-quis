let scene, camera, renderer, carModel, controls;
let modelPaths = [
    '../modelos/low_poly_small_car/scene.gltf',
    '../modelos/lowpoly_car_pack/scene.gltf',
    '../modelos/generic_lowpoly_sedan/scene.gltf'
];

let currentModelIndex = 0;
let autos_usuario;
let cantidad_autos = 0;
let auto;

fetch(window.location.href + "/autos")
    .then(response => {
        if (!response.ok) {
            console.log("Error de respuesta");
        }
        return response.json();
    })
    .then(data => {
        if(data.error){
            alert(data.error)
        }else if (data != ""){
            autos_usuario = data;
            cantidad_autos = data.length;
            auto = autos_usuario[0];
            init();
        }else{
            cambiar_nombre_auto();
            alert ("No tiene ningun auto")
        }
    });

function init() {
    const canvas = document.getElementById('car-canvas');
    const container = document.getElementById('car-container');

    canvas.style.width = '100%';
    canvas.style.height = '100%';

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);

    renderer.setClearColor(0x000000, 0);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    window.addEventListener('resize', () => {
        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    changeCarModel("iniciar");

    document.querySelector('.left-arrow').addEventListener('click', () => changeCarModel('left'));
    document.querySelector('.right-arrow').addEventListener('click', () => changeCarModel('right'));
}

function loadCarModel(modelPath, cameraPosition, controlsTarget) {
    const loader = new THREE.GLTFLoader();
    loader.load(modelPath, function(gltf) {
        if (carModel) {
            scene.remove(carModel);
        }
        carModel = gltf.scene;

        centerModel(carModel);
        scaleModel(carModel, 1);

        scene.add(carModel);
        resetCameraAndControls(cameraPosition, controlsTarget);
        animate();
    }, undefined, function(error) {
        console.error('An error happened', error);
    });
}

function changeCarColor(color) {
    if (carModel) {
        carModel.traverse((child) => {
            if (child.isMesh) {
                // COLOR 1ER AUTO
                if (child.name.includes('Chassis_Chassis_0')) {
                    child.material.color.set(color);
                }
                // COLOR 2ER AUTO
                if (child.name.includes('Body_CarTex_1_0')) {
                    child.material.color.set(color);
                }
                // COLOR 3ER AUTO
                if (child.name.includes('Body_Color1_0')) {
                    child.material.color.set(color);
                }
                if (child.name.includes('Body_Color2_0')) {
                    child.material.color.set(color);
                }
            }
        });
    }
}

function changeCarModel(direction) {
    if (cantidad_autos === 0) {
        cambiar_nombre_auto();
        return;
    }
    if (direction === 'left') {
        currentModelIndex = (currentModelIndex - 1 + cantidad_autos) % cantidad_autos;
    } else if (direction === 'right') {
        currentModelIndex = (currentModelIndex + 1) % cantidad_autos;
    }
    auto = autos_usuario[currentModelIndex]
    if (auto.modelo === modelPaths[0]) {
        loadCarModel(modelPaths[0], new THREE.Vector3(0.5, -2, 1), new THREE.Vector3(0, -2.3, 0));
    } else if (auto.modelo === modelPaths[1]) {
        loadCarModel(modelPaths[1], new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0));
    } else if (auto.modelo === modelPaths[2]) {
        loadCarModel(modelPaths[2], new THREE.Vector3(1, -0.7, 0), new THREE.Vector3(0, -0.7, 0));
    }
    setTimeout(() => {
        changeCarColor(auto.color);
    }, 70)

    cambiar_nombre_auto();
}

function cambiar_nombre_auto() {
    const recuadro_nombre_auto = document.getElementById('car-name');
    if (cantidad_autos === 0) {
        recuadro_nombre_auto.textContent = "El garaje se encuentra vacío.";
    } else {
        recuadro_nombre_auto.textContent = auto.nombre;
    }
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function centerModel(model) {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
}

function scaleModel(model, targetScale) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = targetScale / maxDim;
    model.scale.set(scale, scale, scale);
}

function resetCameraAndControls(position, target) {
    camera.position.copy(position);
    controls.target.copy(target);
    controls.update();
}

function borrar_auto(){
    if(cantidad_autos != 0){
        fetch(window.location.href + "/" +auto.nombre,
            {method: "DELETE"})
            .then(response => {
                if (!response.ok) {
                    console.log("Error de respuesta");
                }
                return response.json();
            })
            .then(data => {
                if (data.mensaje){
                    alert(data.mensaje);
                    let nuevo_tamaño = cantidad_autos - 1;
                    if(nuevo_tamaño != 0) {
                        let aux = new Array(nuevo_tamaño);
                        let j = 0;
                        for(let i = 0; i < cantidad_autos; i++){
                            if(!i == currentModelIndex){
                                aux[j] = autos_usuario[i];
                                j++;
                            }
                        }
                        autos_usuario = aux;
                        cantidad_autos = nuevo_tamaño;
                        currentModelIndex = (currentModelIndex) % cantidad_autos;
                        changeCarModel('actual');
                    }else{
                        location.reload();
                    }
    
                }
            })

    }else {
        alert("No tiene ningun auto para eliminar")
    }
    
}

document.addEventListener('DOMContentLoaded', function() {
    var link = document.querySelector('.navbar-link');

    link.addEventListener('mouseenter', function() {
        this.classList.add('animated');
    });

    link.addEventListener('mouseleave', function() {
        this.classList.remove('animated');
    });
});

document.getElementById('btn-change-name').addEventListener('click', function() {
    var form = document.getElementById('change-name-form');
   
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block'; 
    } else {
        form.style.display = 'none'; 
    }
});


function actualizarNombreAuto() {
    if(cantidad_autos != 0){
        const nombreActual = auto.nombre; 
        const nuevoNombre = document.getElementById('new-car-name').value;

        if (!nuevoNombre) {
            alert('Por favor, ingrese un nuevo nombre.');
        }else{ 
            fetch(window.location.href + "/actualizar/" + nombreActual, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nuevo_nombre: nuevoNombre })
            })
            .then(response => {
                if (!response.ok) {
                    console.log("Error de respuesta");
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert(data.mensaje);
                    // Oculta el formulario y muestra el botón de cambiar nombre nuevamente
                    document.getElementById('change-name-form').style.display = 'none';
                    document.getElementById('btn-change-name').style.display = 'block';
                    auto.nombre = nuevoNombre;
                    changeCarModel("actual");
                }
            });
        }
    }else{
        alert("No tiene ningun auto para modificar")
    }    
}

function cancelarCambioNombre() {
    document.getElementById('new-car-name').value = '';
    document.getElementById('change-name-form').style.display = 'none';
    document.getElementById('btn-change-name').style.display = 'block';
}
