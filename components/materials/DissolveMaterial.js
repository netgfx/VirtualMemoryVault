import { Canvas, useFrame, extend, Suspense, BackSide, useThree } from '@react-three/fiber'
import { Float, ContactShadows, OrbitControls, useTexture, shaderMaterial, Html, Environment, Sphere, useIntersect, Torus, Tube, Circle, OrthographicCamera, useVideoTexture, ArcballControls } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useState, useRef, useMemo, useCallback, useLayoutEffect } from 'react'
import { Curves, angle } from 'three-addons'
import * as THREE_ADDONS from 'three-addons'
import _ from 'lodash'
import { Interactive, XR, ARButton, Controllers } from '@react-three/xr'
import fragment from "../../effects/fragment.glsl?raw";
import vertex from "../../effects/vertex.glsl?raw";

export const DissolveMaterial = shaderMaterial(
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
extend({ DissolveMaterial })