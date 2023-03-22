
import {
    AmbientLight,
    BoxGeometry,
    Color,
    DirectionalLight,
    DoubleSide,
    FrontSide,
    Mesh,
    MeshBasicMaterial,
    MeshPhysicalMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    RepeatWrapping,
    Scene,
    TextureLoader,
    WebGLRenderer,
} from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import planeTextureImg from '../assets/planeTexture.jpg';
import doorTextureImg from '../assets/door.jpeg';

import { onMounted, computed, ref } from 'vue';

const useScene = () => {
    const canvas = ref();
    
    const size = computed({
        get() {
            return {
                width: window.outerWidth,
                height: window.outerHeight,
            }
        }
    });

    const sceneInit = () => {
        const scene = new Scene();
        scene.background = new Color(0x666666);
    
        const camera = new PerspectiveCamera(
            75,
            size.value.width / size.value.height,
        );
        camera.far = 100;
        
        const renderer = new WebGLRenderer({
            canvas: canvas.value
        });
        renderer.shadowMap.enabled = true;

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const ambientLight = new AmbientLight();
        ambientLight.color = new Color(0xffffff);
        ambientLight.intensity = 0.5;
        scene.add(ambientLight);

        //directional light
        const light = new DirectionalLight();
        light.position.x = 10;
        light.position.y = 25;
        light.position.z = 50;
        light.color = new Color(0xffffff);
        light.intensity = 0.5;
        light.castShadow = true;
        light.shadow.camera.left = 20;
        light.shadow.camera.right = -20;
        light.shadow.camera.top = 20;
        scene.add(light);
        
        const turnOffControlsAutoRotate = () => {
            controls.autoRotate = false;
        };
        
        const controls = new OrbitControls(camera, canvas.value);
        controls.autoRotate = true;
        
        controls.addEventListener('start', turnOffControlsAutoRotate);

        //plane
        const planeTexture = new TextureLoader().load(planeTextureImg);
        planeTexture.wrapS = RepeatWrapping;
        planeTexture.wrapT = RepeatWrapping;
        planeTexture.repeat.set( 1, 1 );

        const plane = new Mesh(
            new PlaneGeometry(40, 40),
            new MeshPhysicalMaterial({
                map: planeTexture,
                side: DoubleSide,
                reflectivity: 0
            }),
        )
        plane.position.y = -0.1;
        plane.rotation.x = -Math.PI * 0.49;
        plane.receiveShadow = true;
        scene.add(plane);

        // 1 Door model
        const addFirstDoor = () => {
            const doorGeometry = new BoxGeometry(10, 24, 0.2);
    
            const frontDoorTexure = new TextureLoader().load(doorTextureImg);
            frontDoorTexure.wrapS = RepeatWrapping;
            frontDoorTexure.repeat.set( 1, 1 );
    
            const backDoorTexure = new TextureLoader().load(doorTextureImg);
            backDoorTexure.wrapS = RepeatWrapping;
            backDoorTexure.repeat.set( -1, 1 );
    
            const frontDoorMaterial = new MeshBasicMaterial( { map: frontDoorTexure, side: FrontSide } );
            const backDoorMaterial = new MeshBasicMaterial( { map: backDoorTexure, side: FrontSide } );
            const doorFront = new Mesh(doorGeometry, frontDoorMaterial);
            doorFront.position.x = 10;
            doorFront.position.y = 12;
            doorFront.position.z = 0.2;
            const doorBack = new Mesh(doorGeometry, backDoorMaterial);
            doorBack.position.x = 10;
            doorBack.position.y = 12;
            doorBack.position.z = 0;
            doorBack.castShadow = true;
            scene.add(doorFront, doorBack);
        }

        // 2 Door model
        const addSecondDoor = () => {
            const doorGeometry = new BoxGeometry(10, 24, 0.2);
    
            const frontDoorTexure = new TextureLoader().load(doorTextureImg);
            frontDoorTexure.wrapS = RepeatWrapping;
            frontDoorTexure.repeat.set( 1, 1 );
    
            const backDoorTexure = new TextureLoader().load(doorTextureImg);
            backDoorTexure.wrapS = RepeatWrapping;
            backDoorTexure.repeat.set( -1, 1 );
    
            const frontDoorMaterial = new MeshPhysicalMaterial( {map: frontDoorTexure, side: FrontSide } );
            const backDoorMaterial = new MeshPhysicalMaterial( { map: backDoorTexure, side: FrontSide } );
            const doorFront = new Mesh(doorGeometry, frontDoorMaterial);
            doorFront.position.x = -10;
            doorFront.position.y = 12;
            doorFront.position.z = 0.2;
            const doorBack = new Mesh(doorGeometry, backDoorMaterial);
            doorBack.position.x = -10;
            doorBack.position.y = 12;
            doorBack.position.z = 0;
            doorBack.castShadow = true;
            scene.add(doorFront, doorBack);
        }

        addFirstDoor();
        addSecondDoor();
        
        renderer.setSize(size.value.width, size.value.height);
        
        camera.position.z = 40;
        camera.position.y = 10;
        
        const tick = () => {
            controls.update();
            light.position.copy(camera.position)
            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        }
        
        requestAnimationFrame(tick);

    }
    
    onMounted(sceneInit);

    return {
        canvas,
    }
};

export default useScene;