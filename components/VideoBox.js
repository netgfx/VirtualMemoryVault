
import { Canvas, useFrame, extend, Suspense, BackSide, useThree } from '@react-three/fiber'
import { Float, ContactShadows, OrbitControls, useTexture, shaderMaterial, Html, Environment, Sphere, useIntersect, Torus, Tube, Circle, OrthographicCamera, useVideoTexture, ArcballControls } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useState, useRef, useMemo, useCallback, useLayoutEffect } from 'react'
import { Curves, angle } from 'three-addons'
import * as THREE_ADDONS from 'three-addons'
import _ from 'lodash'
import { Interactive, XR, ARButton, Controllers } from '@react-three/xr'

export function VideoBox(props) {
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