import { Canvas, useFrame, extend, Suspense, BackSide, useThree } from '@react-three/fiber'
import { Float, ContactShadows, OrbitControls, useTexture, shaderMaterial, Html, Environment, Sphere, useIntersect, Torus, Tube, Circle, OrthographicCamera, useVideoTexture, ArcballControls } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useState, useRef, useMemo, useCallback, useLayoutEffect } from 'react'
import { Curves, angle } from 'three-addons'
import * as THREE_ADDONS from 'three-addons'
import _ from 'lodash'
import { Interactive, XR, ARButton, Controllers } from '@react-three/xr'
import fragment from "../effects/fragment.glsl?raw";
import vertex from "../effects/vertex.glsl?raw";
import fadeFragment from "../effects/fade/fragment.glsl?raw";
import fadeVertex from "../effects/fade/vertex.glsl?raw";
import { fract } from '../helpers/utils'
//
//import VideoBox from './VideoBox.js' 

const ColorMaterial = shaderMaterial(
    {
        uTime: 0,
        uFreq: 5.0,
        uBorder: 0.05,
        uTexture: null,
        uNoiseTexture: null,
    },
    vertex,
    fragment
)
extend({ ColorMaterial })

const FadeMaterial = shaderMaterial(
    {
        u_time: 1.0,
        fade_size: 0.2,
        uTexture: null,
        u_resolution: new THREE.Vector2(),
        mask_position: 0,
    },
    fadeVertex,
    fadeFragment
)
extend({ FadeMaterial })


export function Box2(props) {
    const { onClick } = props
    // This reference will give us direct access to the mesh
    const mesh = useRef()
    const ref = useIntersect((visible) => console.log('object is visible', visible))
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    //useFrame((state, delta) => (mesh.current.rotation.x += delta))
    // Return view, these are regular three.js elements expressed in JSX

    function VideoMaterial({ url, index }) {
        const texture = useVideoTexture(url)
        console.log(texture)
        return <meshBasicMaterial map={texture} toneMapped={false} attach={`material-${index}`} />
    }

    const clickVideo = (e) => {
        console.log(e.face.materialIndex, e)
        console.log(e.eventObject.material[e.face.materialIndex].map)
        onClick(true);
    }

    return (
        <mesh
            {...props}
            ref={ref}
            onClick={clickVideo}
            scale={active ? 1.5 : 1}
        // onClick={(event) => setActive(!active)}
        //onPointerOver={(event) => setHover(true)}
        //onPointerOut={(event) => setHover(false)}
        >
            <boxGeometry args={[2, 2, 2]} />
            <VideoMaterial index={0} url="https://qsxfdqhsuyovskknxkaj.supabase.co/storage/v1/object/public/imagefetch/10.mp4" />
            <VideoMaterial
                index={1}
                url="https://qsxfdqhsuyovskknxkaj.supabase.co/storage/v1/object/public/threed/file.mp4?t=2022-12-30T18%3A54%3A50.537Z"
            />
            <VideoMaterial
                index={2}
                url="https://qsxfdqhsuyovskknxkaj.supabase.co/storage/v1/object/public/threed/090960863-360-spherical-vr-driving-throu.mp4?t=2023-01-03T16%3A37%3A34.567Z"
            />
            <meshStandardMaterial color={'orange'} attach={'material-3'} />
            <meshStandardMaterial color={'orange'} attach={'material-4'} />
            <meshStandardMaterial color={'orange'} attach={'material-5'} />
        </mesh>
    )
}

const VideoSphere = (props) => {
    const { cameraDefault } = props
    const videoTexture = useVideoTexture('https://qsxfdqhsuyovskknxkaj.supabase.co/storage/v1/object/public/threed/090960863-360-spherical-vr-driving-throu.mp4?t=2023-01-03T16%3A37%3A34.567Z')
    const noiseTexture = useTexture('./noise.png')
    const ref = useRef()
    const { size } = useThree()
    const [showControls, setShowControls] = useState(false)
    const camera = useThree((state) => state.camera)
    var mask_step = useRef(0.01);
    var mask_val = useRef(0.0);

    useFrame((state, delta) => {
        if (!ref.current) return

        var limit = 1.0 - Math.abs(2.0 * fract(5.0 * ref.current.material.uTime) - 1.0);
        //if (ref.current.material.uTime <= limit) return
        // @ts-ignore
        //ref.current.material.uTime += 0.01

        //FADE MATERIAL

        if (mask_val.current >= 1.0) { mask_val.current = 1.0; mask_step.current = -0.01; }
        //else if (mask_val.current <= -0.0) { mask_val.current = 0.0; mask_step.current = 0.01; }
        console.log(mask_val.current, mask_step.current)
        if (mask_val.current >= 1) { return }
        mask_val.current += mask_step.current;
        ref.current.material.mask_position = mask_val.current;
        ref.current.material.u_time += 0.01;
        ///////////////////////
        //console.log("limit is: ", limit)
        //ref.current.rotation.y = Math.sin(state.clock.elapsedTime) / 4
        //console.log(camera)

        //console.log(ref.current.material.uTime, ref.current.rotation.y);
    })

    useEffect(() => {
        //camera.position.set(0, 0.1, 0.1)
        if (ref.current) {
            ref.current.geometry.scale(-1, 1, 1)
            camera.position.set(0, 0, 0.1)
            camera.rotation.set(0, 0, 0)
            console.log(camera)
            window.setTimeout(() => {
                setShowControls(true)
            }, 500)
        }


        //camera.updateProjectionMatrix()
    }, [])

    const speed = 0.2;
    const border = 0.1;

    useLayoutEffect(() => {

    })
    return (
        <>
            <mesh ref={ref}>
                <sphereGeometry />
                {/* <meshBasicMaterial map={videoTexture} /> */}
                {/* <colorMaterial key={ColorMaterial.key}
                    uFreq={speed}
                    uBorder={border}
                    uTexture={videoTexture}
                    uNoiseTexture={noiseTexture}
                /> */}
                <fadeMaterial key={FadeMaterial.key} u_time={1.0} u_resolution={new THREE.Vector2(window.innerWidth, window.innerHeight)} uTexture={videoTexture} mask_position={0} />
                {/* <meshBasicMaterial map={videoTexture} side={BackSide} /> */}
            </mesh>
            {showControls && <OrbitControls makeDefault enablePan={false} />}
        </>
    )
}

export function MainScene() {
    const camera = useThree((state) => state.camera)
    const [showVideo, setShowVideo] = useState(false)
    const [showControls, setShowControls] = useState(false)
    var cameraRef = useRef(null)

    useEffect(() => {
        cameraRef.current = camera
        console.log(camera.position)
        window.setTimeout(() => {
            setShowControls(true)
        }, 500)
    }, [])

    useEffect(() => {
        console.log(showVideo)
    }, [showVideo])

    const getBox = () => {
        if (showVideo) {
            return <Box2 onClick={setShowVideo} />
        }
        else {
            return null
        }
    }

    return (<XR referenceSpace="local">

        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        {!showVideo && <Box2 onClick={setShowVideo} />}

        {showVideo && <VideoSphere cameraDefault={cameraRef} />}
        {(showControls === true && showVideo === false) && <ArcballControls minDistance={5} setGizmosVisible={true} enablePan={false}
            autoRotate={false} autoRotateSpeed={0.15} gizmo={true} />}
        <Controllers />
        <Html style={{ position: "fixed", top: "24px", right: "24px", width: "100%", height: "100%" }}>
            <img src={"./close.png"} style={{ width: "48px", }} />
        </Html>
    </XR>)
}

////////////////////////////////////////////////////////////////////////////
export default function App() {

    const getNear = () => {
        if (typeof window !== "undefined") {
            return window.innerWidth / window.innerHeight
        }
        else {
            return 0.1
        }
    }

    const getPixelRatio = () => {
        if (typeof window !== "undefined") {
            return window.devicePixelRatio
        }
        else {
            return 0.1
        }
    }

    return (

        <>
            <ARButton />
            <Canvas camera={{
                fov: 75, aspect: getNear(), near: 0.1, far: 1100,
                position: [0, 0, 0.1]
            }} gl={{ devicePixelRatio: getPixelRatio() }}>
                <MainScene />
            </Canvas>
        </>
    )
}
