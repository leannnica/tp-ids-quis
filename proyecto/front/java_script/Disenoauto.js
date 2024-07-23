let scene, camera, renderer, carModel, controls, color_actual;
let modelPaths = [
    '../modelos/low_poly_small_car/scene.gltf',
    '../modelos/lowpoly_car_pack/scene.gltf',
    '../modelos/generic_lowpoly_sedan/scene.gltf'
];
let currentModelIndex = 0;

function init() {
    const canvas = document.getElementById('car-canvas');
    const container = document.getElementById('car-container');

    canvas.style.width = '100%';
    canvas.style.height = '100%';

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);

    renderer.setClearColor(0xffffff);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

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

    loadCarModel(modelPaths[currentModelIndex], new THREE.Vector3(0.5, -2, 1), new THREE.Vector3(0, -2.3, 0));

    document.getElementById('color-picker').addEventListener('input', (event) => {
        const selectedColor = event.target.value;
        changeCarColor(selectedColor);
    });

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
                if (child.name.includes('Body_Color1_0')) {
                    child.material.color.set(color);
                }
                if (child.name.includes('Body_Color2_0')) {
                    child.material.color.set(color);
                }
            }
            color_actual = color;
        });
    }
}

function changeCarModel(direction) {
    if (direction === 'left') {
        currentModelIndex = (currentModelIndex - 1 + modelPaths.length) % modelPaths.length;
    } else if (direction === 'right') {
        currentModelIndex = (currentModelIndex + 1) % modelPaths.length;
    }

    if (currentModelIndex === 0) {
        loadCarModel(modelPaths[currentModelIndex], new THREE.Vector3(0.5, -2, 1), new THREE.Vector3(0, -2.3, 0));
    } else if (currentModelIndex === 1) {
        loadCarModel(modelPaths[currentModelIndex], new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0));
    } else if (currentModelIndex === 2) {
        loadCarModel(modelPaths[currentModelIndex], new THREE.Vector3(1, -0.7, 0), new THREE.Vector3(0, -0.7, 0));
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

function guardar_auto(event) {
    event.preventDefault()
    if (n_usuario && color_actual){
        let nombre_nuevo = document.getElementById("nombre").value;
        let modelo_nuevo = modelPaths[currentModelIndex];
        fetch(window.location.href + "/guardar-auto",
            {method: "POST" , 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify( {
                nombre: nombre_nuevo,
                modelo: modelo_nuevo,
                color: color_actual,
                } )
            })
            .then(response => {
                if (!response.ok) {
                    console.log("Error de respuesta");
                }
                return response.json();
            })
            .then(data => {
                if (data.error){
                    alert(data.error);
                }else{
                    alert(data.mensaje);
                }
            })
        
    }else if (!n_usuario ){
        alert("Debe estar logueado para realizar esa acción");
    }else{
        alert("Debe elegir algun color")
    }
    
}

window.onload = init;
