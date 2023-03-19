import { Canvas, useFrame, extend, Suspense, BackSide, useThree } from '@react-three/fiber'
import { Float, ContactShadows, OrbitControls, useTexture, shaderMaterial, Html, Environment, Sphere, useIntersect, Torus, Tube, Circle, OrthographicCamera, useVideoTexture, ArcballControls } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useState, useRef, useMemo, useCallback, useLayoutEffect } from 'react'
import { Curves, angle } from 'three-addons'
import * as THREE_ADDONS from 'three-addons'
import _ from 'lodash'
import { Interactive, XR, ARButton, Controllers } from '@react-three/xr'
import { gsap } from "gsap"
import { fract } from '../helpers/utils'
import { DissolveMaterial } from './materials/DissolveMaterial'
import { FadeMaterial } from './materials/FadeMaterial'
import { Flex, Box } from '@react-three/flex'



// The video sphere


export const VideoSphere = (props) => {
    const { cameraDefault, videoSrc } = props
    const videoTexture = useVideoTexture(videoSrc)
    const noiseTexture = useTexture('./noise.png')
    const ref = useRef()
    const orbitRef = useRef()
    const { size } = useThree()
    const [showControls, setShowControls] = useState(false)
    const camera = useThree((state) => state.camera)
    var mask_step = useRef(0.01);
    var mask_val = useRef(0.0);
    const { gl } = useThree();

    useFrame((state, delta) => {

        if (!ref.current) return

        var limit = 1.0 - Math.abs(2.0 * fract(5.0 * ref.current.material.uTime) - 1.0);
        //if (ref.current.material.uTime <= limit) return
        // @ts-ignore
        //ref.current.material.uTime += 0.01

        //FADE MATERIAL

        if (mask_val.current >= 1.0) { mask_val.current = 1.0; mask_step.current = -0.01; }
        //else if (mask_val.current <= -0.0) { mask_val.current = 0.0; mask_step.current = 0.01; }
        //console.log(mask_val.current, mask_step.current)
        if (mask_val.current >= 1) {
            if (showControls === false) {
                setShowControls(true)
            }
            return
        }
        mask_val.current += mask_step.current;
        ref.current.material.mask_position = mask_val.current;
        ref.current.material.u_time += 0.01;
        ///////////////////////
        //console.log("limit is: ", limit)
        //ref.current.rotation.y = Math.sin(state.clock.elapsedTime) / 4
        //console.log(camera)

        //console.log(ref.current.material.uTime, ref.current.rotation.y);

        if (orbitRef.current) {
            orbitRef.current.update()
        }
    })

    // useFrame((state, delta) => {

    // });

    const handleClick = (e) => {
        console.log(orbitRef.current.getDistance(), orbitRef.current.zoom)
        // orbitRef.current.zoom = 0.54
        // orbitRef.current.update()
        //camera.position.set(0, 0, -0.1)
        orbitRef.current.minDistance = 0.54
        gsap.to(orbitRef.current, {
            maxDistance: 0.54, // double the zoom value
            duration: 0.5, // animation duration in seconds
            ease: 'power1.out', // easing function
            onComplete: () => {
                orbitRef.current.maxDistance = 3.0
            }
        });
    }

    useEffect(() => {
        //camera.position.set(0, 0.1, 0.1)

        if (ref.current) {
            ref.current.geometry.scale(-1, 1, 1)
            camera.position.set(0, 0, 0.1)
            camera.rotation.set(0, 0, 0)
            console.log(camera)
            // window.setTimeout(() => {
            //     console.log("controls: ", Date.now())

            // }, 610)
        }


        //camera.updateProjectionMatrix()
    }, [])

    useEffect(() => {
        if (showControls) {

            camera.position.set(0, 0, -0.1)
            gsap.to(orbitRef.current, {
                minDistance: 3.0, // double the zoom value
                duration: 0.5,
                delay: 0.2, // animation duration in seconds
                ease: 'power1.out', // easing function
                onComplete: () => {
                    orbitRef.current.maxDistance = 3.0
                }
            });
            console.log(ref.current)
        }
    }, [showControls])

    const speed = 0.2;
    const border = 0.1;

    useEffect(() => {
        if (orbitRef.current) {

        }
    }, [orbitRef])


    return (
        <>
            <mesh ref={ref} onClick={handleClick}>
                <sphereGeometry needsUpdate={true} />
                {/* <meshBasicMaterial map={videoTexture} /> */}
                {/* <colorMaterial key={ColorMaterial.key}
                    uFreq={speed}
                    uBorder={border}
                    uTexture={videoTexture}
                    uNoiseTexture={noiseTexture}
                /> */}
                <fadeMaterial key={FadeMaterial.key} u_time={1.0} u_resolution={new THREE.Vector2(window.innerWidth, window.innerHeight)} uTexture={videoTexture} mask_position={0} onUpdate={(self) => (self.needsUpdate = true)} />
                {/* <meshBasicMaterial map={videoTexture} side={BackSide} /> */}
            </mesh>
            {showControls && <OrbitControls ref={orbitRef} makeDefault enablePan={false} maxDistance={3.0} args={[camera, gl.domElement]} />}
        </>
    )
}