import { Canvas, useFrame, extend, Suspense, BackSide, useThree } from '@react-three/fiber'
import { Float, ContactShadows, OrbitControls, useTexture, shaderMaterial, Html, Environment, Sphere, useIntersect, Torus, Tube, Circle, OrthographicCamera, useVideoTexture, ArcballControls } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useState, useRef, useMemo, useCallback, useLayoutEffect } from 'react'
import { Curves, angle } from 'three-addons'
import * as THREE_ADDONS from 'three-addons'
import _ from 'lodash'
import { Interactive, XR, ARButton, Controllers } from '@react-three/xr'
import { VideoSphere } from './VideoSphere'
import { VideoBox } from './VideoBox'
//
//import VideoBox from './VideoBox.js' 





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

        {!showVideo && <VideoBox onClick={setShowVideo} />}

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
