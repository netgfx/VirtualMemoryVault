import { Canvas, useFrame, extend, Suspense, BackSide, useThree } from '@react-three/fiber'
import { Float, ContactShadows, OrbitControls, useTexture, shaderMaterial, Html, Sphere, useIntersect, Torus, Tube, Circle, OrthographicCamera, useVideoTexture, ArcballControls, Environment, MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useState, useRef, useMemo, useCallback, useLayoutEffect } from 'react'
import { Curves, angle } from 'three-addons'
import * as THREE_ADDONS from 'three-addons'
import _ from 'lodash'
import { Interactive, XR, ARButton, Controllers, useXR } from '@react-three/xr'
import { VideoSphere } from './VideoSphere'
import { VideoBox } from './VideoBox'
import { Perf } from 'r3f-perf'

//
//import VideoBox from './VideoBox.js' 


export function XRContext(props) {
    const camera = useThree((state) => state.camera)
    var cameraRef = useRef(null)
    const [showVideo, setShowVideo] = useState(true)
    const {
        // An array of connected `XRController`
        controllers,
        // Whether the XR device is presenting in an XR session
        isPresenting,
        // Whether hand tracking inputs are active
        isHandTracking,
        // A THREE.Group representing the XR viewer or player
        player,
        // The active `XRSession`
        session,
        // `XRSession` foveation. This can be configured as `foveation` on <XR>. Default is `0`
        foveation,
        // `XRSession` reference-space type. This can be configured as `referenceSpace` on <XR>. Default is `local-floor`
        referenceSpace
    } = useXR()

    const [showControls, setShowControls] = useState(true)



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

    useEffect(() => {
        console.log(player, session)
    }, [session])


    return <group> <ambientLight />
        <pointLight position={[10, 10, 10]} />

        {!showVideo && <VideoBox onClick={setShowVideo} />}

        {showVideo && <VideoSphere videoSrc={"https://qsxfdqhsuyovskknxkaj.supabase.co/storage/v1/object/public/hosted-images/videos360/chef.mp4?t=2023-03-19T09%3A22%3A22.730Z"} cameraDefault={cameraRef} />}
        {/* {(showControls === true && showVideo === false) && <ArcballControls minDistance={5} setGizmosVisible={true} enablePan={false}
            autoRotate={false} autoRotateSpeed={0.15} gizmo={true} />} */}
        <Controllers />
        {/* <OrbitControls minDistance={5} setGizmosVisible={true} enablePan={false}
            autoRotate={false} autoRotateSpeed={0.15} gizmo={true} /> */}
        {/* <Html style={{ position: "fixed", top: "24px", right: "24px", width: "100%", height: "100%" }}>
            <img src={"./close.png"} style={{ width: "48px", }} />
        </Html> */}
        {/* <Perf position="top-left" style={{ transform: 'scale(1.0)' }} /> */}

    </group>
}


export function MainScene() {




    return (
        <XR referenceSpace="local">
            <XRContext />
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
            {/* <ARButton /> */}
            <Canvas camera={{
                fov: 75, aspect: getNear(), near: 0.1, far: 1100,
                position: [0, 0, -0.1]
            }} gl={{ devicePixelRatio: getPixelRatio() }}>
                <color attach="background" args={['#191920']} />
                <MainScene />
                {/* <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[50, 50]} />
                    <MeshReflectorMaterial
                        blur={[300, 100]}
                        resolution={2048}
                        mixBlur={1}
                        mixStrength={50}
                        roughness={1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        color="#050505"
                        metalness={0.5}
                    />
                </mesh> */}
                <Environment preset="city" />
            </Canvas>
        </>
    )
}
