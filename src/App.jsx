import "./App.css"
import { Canvas } from "@react-three/fiber"
import Experience from "./components/Experience"

function App() {
	return (
		// "#ececec"
		<>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 1,
					display: "flex",
					justifyContent: "center",
					pointerEvents: "none",
				}}>
				{/* <h1
					style={{
						color: "black",
					}}>
					click on the outdoors 3d text to go to a new page...
				</h1> */}
			</div>
			<Canvas
				shadows
				style={{
					backgroundColor: "#ececec",
					height: "100vh",
					width: "100vw",
				}}
				camera={{ position: [0, 0, 8], fov: 42 }}>
				<color attach="background" args={["#ececec"]} />
				<fog attach="fog" args={["#ececec", 0, 30]} />
				{/* <color attach="background" args= /> */}
				<Experience />
			</Canvas>
		</>
	)
}

export default App
