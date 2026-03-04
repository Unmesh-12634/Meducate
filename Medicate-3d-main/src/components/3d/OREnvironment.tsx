import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * OREnvironment — adds a cinematic operation-theater room to an existing Three.js scene.
 * Usage: Call `useOREnvironment(sceneRef)` and it will inject geometry + lighting.
 * The returned `cleanup` disposes everything when the component unmounts.
 */
export function useOREnvironment(
    sceneRef: React.MutableRefObject<THREE.Scene | null>,
    enabled: boolean = true
) {
    const orGroupRef = useRef<THREE.Group | null>(null);

    useEffect(() => {
        if (!sceneRef.current || !enabled) return;
        const scene = sceneRef.current;

        const orGroup = new THREE.Group();
        orGroupRef.current = orGroup;

        // ── Materials ──────────────────────────────────────────────────────────
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x1a2030,
            roughness: 0.8,
            metalness: 0.1,
        });
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0x1e2535,
            roughness: 0.9,
        });
        const tableMat = new THREE.MeshStandardMaterial({
            color: 0x8090a0,
            roughness: 0.3,
            metalness: 0.7,
        });
        const tablePadMat = new THREE.MeshStandardMaterial({
            color: 0x263040,
            roughness: 0.7,
        });
        const lampMat = new THREE.MeshStandardMaterial({
            color: 0x9fb0c0,
            roughness: 0.15,
            metalness: 0.9,
        });
        const lampGlowMat = new THREE.MeshStandardMaterial({
            color: 0xfff8e1,
            emissive: new THREE.Color(0xfff8e1),
            emissiveIntensity: 2.5,
            roughness: 0.1,
        });
        const trayMat = new THREE.MeshStandardMaterial({
            color: 0xc0ccd8,
            roughness: 0.2,
            metalness: 0.8,
        });
        const monitorMat = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            roughness: 0.8,
        });
        const screenMat = new THREE.MeshStandardMaterial({
            color: 0x002a1a,
            emissive: new THREE.Color(0x00A896),
            emissiveIntensity: 0.6,
            roughness: 0.5,
        });


        // ── Floor ──────────────────────────────────────────────────────────────
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -60;
        orGroup.add(floor);

        // Floor grid lines
        const gridHelper = new THREE.GridHelper(300, 30, 0x334455, 0x222b38);
        gridHelper.position.y = -59.5;
        orGroup.add(gridHelper);

        // ── Walls ──────────────────────────────────────────────────────────────
        const backWall = new THREE.Mesh(new THREE.PlaneGeometry(300, 200), wallMat);
        backWall.position.set(0, 40, -150);
        orGroup.add(backWall);

        const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(300, 200), wallMat);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.set(-150, 40, 0);
        orGroup.add(leftWall);

        const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(300, 200), wallMat);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.position.set(150, 40, 0);
        orGroup.add(rightWall);

        // ── Ceiling ────────────────────────────────────────────────────────────
        const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), wallMat);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = 140;
        orGroup.add(ceiling);

        // ── Surgical Table ─────────────────────────────────────────────────────
        // Table legs
        const legGeo = new THREE.CylinderGeometry(1.5, 1.5, 55, 8);
        const legPositions: [number, number, number][] = [
            [-14, -33, -18], [14, -33, -18],
            [-14, -33, 18], [14, -33, 18],
        ];
        legPositions.forEach(([x, y, z]) => {
            const leg = new THREE.Mesh(legGeo, tableMat);
            leg.position.set(x, y, z);
            orGroup.add(leg);
        });

        // Table base column
        const baseCol = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 12, 12), tableMat);
        baseCol.position.set(0, -54, 0);
        orGroup.add(baseCol);

        // Table top surface
        const tableTop = new THREE.Mesh(new THREE.BoxGeometry(40, 3, 50), tableMat);
        tableTop.position.set(0, -5, 0);
        orGroup.add(tableTop);

        // Table padding (green surgical drape)
        const tablePad = new THREE.Mesh(new THREE.BoxGeometry(36, 2, 46), tablePadMat);
        tablePad.position.set(0, -3, 0);
        orGroup.add(tablePad);

        // ── Overhead Surgical Lamp ─────────────────────────────────────────────
        // Arm from ceiling
        const armGeo = new THREE.CylinderGeometry(1, 1, 80, 8);
        const lampArm = new THREE.Mesh(armGeo, lampMat);
        lampArm.position.set(0, 80, 0);
        orGroup.add(lampArm);

        // Lamp housing (wide disk)
        const lampHousing = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 6, 32), lampMat);
        lampHousing.position.set(0, 42, 0);
        orGroup.add(lampHousing);

        // Lamp emitter (inner glow)
        const lampEmitter = new THREE.Mesh(new THREE.CylinderGeometry(18, 20, 3, 32), lampGlowMat);
        lampEmitter.position.set(0, 39, 0);
        orGroup.add(lampEmitter);

        // Secondary smaller ring lamps
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const r = 12;
            const smallLamp = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 2, 12), lampGlowMat);
            smallLamp.position.set(Math.cos(angle) * r, 38, Math.sin(angle) * r);
            orGroup.add(smallLamp);
        }

        // ── Instrument Tray (right side) ───────────────────────────────────────
        const trayBase = new THREE.Mesh(new THREE.BoxGeometry(24, 1.5, 16), trayMat);
        trayBase.position.set(48, -8, 0);
        orGroup.add(trayBase);

        // Tray stand
        const trayStand = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 50, 8), trayMat);
        trayStand.position.set(48, -33, 0);
        orGroup.add(trayStand);

        // Instruments on tray (simplified as small boxes/cylinders)
        const instrumentPositions: [number, number, number, number][] = [
            [-8, 0, -5, 0], [-4, 0, -5, 0.1], [0, 0, -5, -0.05],
            [4, 0, -5, 0.15], [8, 0, -5, -0.1], [-6, 0, 3, 0.08],
        ];
        instrumentPositions.forEach(([x, _y, z, rot]) => {
            const inst = new THREE.Mesh(
                new THREE.CylinderGeometry(0.4, 0.4, 12, 6),
                new THREE.MeshStandardMaterial({ color: 0xd0d8e0, metalness: 0.9, roughness: 0.1 })
            );
            inst.position.set(48 + x, -2, z);
            inst.rotation.z = Math.PI / 2 + rot;
            orGroup.add(inst);
        });

        // ── Vitals Monitor (left side) ─────────────────────────────────────────
        // Monitor stand
        const monStand = new THREE.Mesh(new THREE.BoxGeometry(3, 50, 3), trayMat);
        monStand.position.set(-52, -34, 0);
        orGroup.add(monStand);

        // Monitor body
        const monBody = new THREE.Mesh(new THREE.BoxGeometry(28, 18, 3), monitorMat);
        monBody.position.set(-52, -2, 0);
        orGroup.add(monBody);

        // Monitor screen (glowing)
        const monScreen = new THREE.Mesh(new THREE.BoxGeometry(24, 14, 0.5), screenMat);
        monScreen.position.set(-52, -2, 1.6);
        orGroup.add(monScreen);

        // Second monitor above
        const mon2Body = new THREE.Mesh(new THREE.BoxGeometry(28, 18, 3), monitorMat);
        mon2Body.position.set(-52, 20, 0);
        orGroup.add(mon2Body);

        const mon2Screen = new THREE.Mesh(new THREE.BoxGeometry(24, 14, 0.5), screenMat);
        mon2Screen.position.set(-52, 20, 1.6);
        orGroup.add(mon2Screen);

        // ── IV Stand (right, near patient) ────────────────────────────────────
        const ivPole = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 80, 8), trayMat);
        ivPole.position.set(32, 0, -28);
        orGroup.add(ivPole);

        // IV bag
        const ivBag = new THREE.Mesh(new THREE.BoxGeometry(6, 10, 2), new THREE.MeshStandardMaterial({
            color: 0xaaddff,
            transparent: true,
            opacity: 0.7,
            roughness: 0.1,
        }));
        ivBag.position.set(32, 42, -28);
        orGroup.add(ivBag);

        // ── LIGHTING ───────────────────────────────────────────────────────────
        // Primary surgical spotlight (from lamp above)
        const surgicalSpot = new THREE.SpotLight(0xfff5e0, 8, 200, Math.PI / 5, 0.3, 1.5);
        surgicalSpot.position.set(0, 38, 0);
        surgicalSpot.target.position.set(0, -5, 0);
        scene.add(surgicalSpot);
        scene.add(surgicalSpot.target);

        // Cool ambient fill (OR room feel)
        const ambientOR = new THREE.AmbientLight(0x80a0c0, 0.3);
        scene.add(ambientOR);

        // Monitor glow (left)
        const monGlow = new THREE.PointLight(0x00A896, 1.5, 80);
        monGlow.position.set(-52, 10, 5);
        scene.add(monGlow);

        // Rim accent light (cyan-teal from back)
        const rimBack = new THREE.PointLight(0x00c4b4, 2, 100);
        rimBack.position.set(0, 20, -80);
        scene.add(rimBack);

        // Red alert subtle fill
        const alertFill = new THREE.PointLight(0xff2244, 0.3, 120);
        alertFill.position.set(-80, 10, 20);
        scene.add(alertFill);

        scene.add(orGroup);

        return () => {
            // Dispose all geometries and materials
            orGroup.traverse((obj: THREE.Object3D) => {
                if (obj instanceof THREE.Mesh) {
                    obj.geometry.dispose();
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach((m: THREE.Material) => m.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
            });
            scene.remove(orGroup);
            scene.remove(surgicalSpot);
            scene.remove(surgicalSpot.target);
            scene.remove(ambientOR);
            scene.remove(monGlow);
            scene.remove(rimBack);
            scene.remove(alertFill);
        };
    }, [enabled]);
}
