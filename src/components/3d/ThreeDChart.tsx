import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import * as THREE from "three";

interface ThreeDChartProps {
  data: Array<{ value: number; timestamp: string }>;
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex items-center justify-center h-full p-4 text-red-500">
      <p>Error loading 3D chart: {error.message}</p>
    </div>
  );
}

function Scene({ data }: ThreeDChartProps) {
  // Optimize points calculation with better memoization
  const points = useMemo(() => {
    if (data.length === 0) return [];
    
    // Reduce number of points for better performance
    const stride = Math.max(1, Math.floor(data.length / 100)); // Sample max 100 points
    const sampledData = data.filter((_, index) => index % stride === 0);
    
    return sampledData.map((reading, index) => {
      const x = index * 0.5 - (sampledData.length * 0.5) / 2;
      const y = reading.value;
      const z = 0;
      return [x, y, z] as const;
    });
  }, [data]);

  // Optimize geometry creation
  const lineGeometry = useMemo(() => {
    if (points.length < 2) return null;
    
    const positions = new Float32Array(points.length * 3);
    points.forEach((point, i) => {
      positions[i * 3] = point[0];
      positions[i * 3 + 1] = point[1];
      positions[i * 3 + 2] = point[2];
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [points]);

  // Memoize material to prevent unnecessary recreations
  const lineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({ color: "#60a5fa", linewidth: 2 });
  }, []);

  // Memoize sphere geometries
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(0.2), []);
  const sphereMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#60a5fa" }), []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls 
        enableDamping={false} 
        rotateSpeed={0.5}
        zoomSpeed={0.5}
        panSpeed={0.5}
      />
      
      {points.map((position, index) => (
        <mesh 
          key={index} 
          position={position}
          geometry={sphereGeometry}
          material={sphereMaterial}
        />
      ))}
      
      {lineGeometry && (
        <primitive object={new THREE.Line(lineGeometry, lineMaterial)} />
      )}
    </>
  );
}

export function ThreeDChart({ data }: ThreeDChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        No data available
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[300px]">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
          <Canvas 
            camera={{ position: [0, 0, 15], fov: 75 }}
            onCreated={({ gl }) => {
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
              gl.setClearColor('#1e293b', 0.1);
            }}
            frameloop="demand" // Only render when needed
            dpr={[1, 2]} // Limit DPR range
          >
            <Scene data={data} />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}