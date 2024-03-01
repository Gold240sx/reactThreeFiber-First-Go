import {
	CameraControls,
	Environment,
	Float,
	MeshReflectorMaterial,
	RenderTexture,
	Text,
} from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useAtom } from "jotai"
import { Color } from "three"
import Camping from "../components/Camping"
import { degToRad, lerp } from "three/src/math/MathUtils"
import { useRef, useLayoutEffect, useEffect } from "react"
import { currentPageAtom } from "./UI"
import { Reflector, Text3D, useTexture } from "@react-three/drei"
// import { useLoader } from "@react-three/fiber"
// import * as THREE from "three"

import antaFont from "/Users/michaelmartell/Documents/CODE/Web/2024 Projects/reactFiber/public/fonts/Anta_Regular.json"

// const texture = useLoader(THREE.TextureLoader, "/path/to/your/image.png")

const bloomColor = new Color("#fff")
bloomColor.multiplyScalar(1.5)

const Experience = () => {
	const controls = useRef()
	const meshFitCameraHome = useRef()
	const meshFitCameraStore = useRef()
	const textMaterial = useRef()
	const [currentPage, setCurrentPage] = useAtom(currentPageAtom)

	useFrame((_, delta) => {
		textMaterial.current.opacity = lerp(
			textMaterial.current.opacity,
			currentPage === "home" || currentPage === "intro" ? 1 : 0,
			delta * 1.5
		)
	})

	const intro = async () => {
		controls.current.dolly(-22) //zooms out
		controls.current.smoothTime = 1 // smooths the zoom and lengthens the duration
		controls.current.dolly(22, true) //zooms in, animated
		setTimeout(() => {
			setCurrentPage("home")
		}, 1200)
		fitCamera()
	}

	const fitCamera = async () => {
		if (currentPage === "store") {
			controls.current.smoothTime = 0.8
			controls.current.fitToBox(meshFitCameraStore.current, true)
		} else {
			controls.current.smoothTime = 1.6
			controls.current.fitToBox(meshFitCameraHome.current, true)
		}
	}

	useEffect(() => {
		intro()
	}, [])

	useEffect(() => {
		fitCamera()
		window.addEventListener("resize", fitCamera)
		return () => window.removeEventListener("resize", fitCamera)
	}, [currentPage])

	const matcap = useTexture("./textures/black-pearl.png")

	return (
		<>
			<CameraControls
				ref={controls}
				enablePan={false}
				// minPolarAngle={Math.PI / 2} // in conjunction with below prevents camera any tilting up/down
				maxPolarAngle={Math.PI / 2} // Prevents the camera from going below the ground
				makeDefault
			/>
			<mesh ref={meshFitCameraHome} position-z={1.5} visible={false}>
				<boxGeometry args={[7.5, 2, 2]} />
				<meshBasicMaterial color="orange" transparent opacity={0.5} />
			</mesh>
			<Text
				font={"fonts/Anta-Regular.ttf"}
				position-x={-1.3}
				position-y={0.4}
				position-z={1}
				anchorY={"bottom"}
				textAlign="center"
				lineHeight={0.8}
				letterSpacing={-0.05}
				rotation-y={degToRad(30)}
				// outlineWidth={0.01}
				// outlineColor={"#000000"}
				// outlineOffsetZ={0.01}
				// receiveShadow={true}
				// strokeColor={"#0569A2"}
				// strokeWidth={0.01}
				// castShadow={true}
				// depthOffset={10}
				// fontSize={0.5}
			>
				CAMPING
				<meshBasicMaterial
					color={bloomColor}
					toneMapped={false}
					ref={textMaterial}>
					{/* places the rotating map as a texture upon the text. */}
					<RenderTexture attach={"map"}>
						<color attach="background" args={["#fff"]} />
						<Environment preset="sunset" />
						<Float floatIntensity={4} rotationIntensity={5}>
							<Camping
								scale={1.6}
								rotation-y={-degToRad(25)}
								rotation-x={degToRad(40)}
								position-y={-0.5}
							/>
						</Float>
					</RenderTexture>
				</meshBasicMaterial>
			</Text>
			<Text3D
				font={antaFont}
				position-x={-5}
				position-y={-0.5}
				position-z={3}
				anchorY={"bottom"}
				textAlign="center"
				lineHeight={0.8}
				letterSpacing={-0.05}
				rotation-y={degToRad(30)}
				outlineWidth={0.01}
				castShadow
				receiveShadow
				outlineColor={"#000000"}
				bevelSize={0.05}
				onClick={() => {
					// route to another page
					// setCurrentPage("outdoors")
					window.location.href = "outdoors"
				}}
				// outlineOffsetZ={0.01}
				// receiveShadow={true}
				// strokeColor={"#0569A2"}
				// strokeWidth={0.01}
				// castShadow={true}
				// depthOffset={10}
				// fontSize={0.5}
			>
				OUTDOORS
				<meshMatcapMaterial matcap={matcap} flatshading={false} />
				{/* <meshBasicMaterial
					// color={bloomColor}
					toneMapped={false}
					ref={textMaterial}> 
				</meshBasicMaterial>*/}
			</Text3D>

			{/* eslint-disable-next-line */}
			<group rotation-y={degToRad(-25)} position-x={3}>
				<Camping scale={0.6} html />
				{/* <mesh ref={meshFitCameraStore} visible={false}>
					<boxGeometry
					// args={[2, 1, 2]}
					/>
					<meshBasicMaterial color="red" transparent opacity={0.5} />
				</mesh> */}
			</group>
			<Reflector
				blur={[100, 100]}
				resolution={2048}
				mixBlur={0.5}
				mixStrength={0.25}
				receiveShadow
				args={[75, 75]} // defines the size of the plane
				rotation={[-Math.PI * 0.5, 0, 0]}
				mirror={0.5}
				minDepthThreshold={0.4}
				maxDepthThreshold={1.4}
				depthScale={50}
				position-y={-0.47} // defines the y height of the plane
				roughness={1}
				opacity={0.5}
				// color="#FFFFFF"
				// transparent
				// metalness={0.5}
			>
				{(Material, props) => (
					<Material metalness={0.5} roughness={1} {...props} />
				)}
			</Reflector>
			<Environment preset="sunset" />
		</>
	)
}

export const Ground = () => {
	return (
		<mesh
			position={[0, 0, 0]}
			rotation={[-Math.PI * 0.5, 0, 0]}
			receiveShadow>
			<planeGeometry attach="geometry" args={[100, 100]} />
			<meshStandardMaterial color={"#F20689"} />
		</mesh>
	)
}

export default Experience
