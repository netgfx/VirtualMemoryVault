import { Canvas, useFrame, extend, Suspense, BackSide, useThree } from '@react-three/fiber'
import { Float, ContactShadows, OrbitControls, useTexture, shaderMaterial, Html, Environment, Sphere, useIntersect, Torus, Tube, Circle, OrthographicCamera, useVideoTexture, ArcballControls } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useState, useRef, useMemo, useCallback, useLayoutEffect } from 'react'
import { Curves, angle } from 'three-addons'
import * as THREE_ADDONS from 'three-addons'
import _ from 'lodash'
import { Interactive, XR, ARButton, Controllers } from '@react-three/xr'

import fadeFragment from "../../effects/fade/fragment.glsl?raw";
import fadeVertex from "../../effects/fade/vertex.glsl?raw";

export const FadeMaterial = shaderMaterial(
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