import * as THREE from 'three';
import { useEffect, useRef } from 'react';

export default function NeuralBackground() {
  const mountRef = useRef(null);
  useEffect(() => {
    const W = mountRef.current.clientWidth;
    const H = mountRef.current.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 1000);
    camera.position.z = 8;
    const nodeCount = 180;
    const nodeData = [];
    const pos = [];
    for (let i=0; i<nodeCount; i++) {
      const x=(Math.random()-.5)*12, y=(Math.random()-.5)*12, z=(Math.random()-.5)*6;
      nodeData.push({x,y,z});
      pos.push(x,y,z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
      color:0x00d4ff, size:0.08, transparent:true, opacity:0.8,
      blending:THREE.AdditiveBlending
    })));
    const edgeVerts=[];
    for (let i=0;i<nodeCount;i++) for(let j=i+1;j<nodeCount;j++) {
      const dx=nodeData[i].x-nodeData[j].x, dy=nodeData[i].y-nodeData[j].y, dz=nodeData[i].z-nodeData[j].z;
      if (Math.sqrt(dx*dx+dy*dy+dz*dz)<2.8) {
        edgeVerts.push(nodeData[i].x,nodeData[i].y,nodeData[i].z,nodeData[j].x,nodeData[j].y,nodeData[j].z);
      }
    }
    const eGeo=new THREE.BufferGeometry();
    eGeo.setAttribute('position',new THREE.Float32BufferAttribute(edgeVerts,3));
    scene.add(new THREE.LineSegments(eGeo, new THREE.LineBasicMaterial({
      color:0x7c3aed,transparent:true,opacity:0.15,blending:THREE.AdditiveBlending
    })));
    let frame;
    const animate=()=>{ frame=requestAnimationFrame(animate); scene.rotation.y+=0.0008; scene.rotation.x+=0.0003; renderer.render(scene,camera); };
    animate();
    return ()=>{ cancelAnimationFrame(frame); renderer.dispose(); mountRef.current?.removeChild(renderer.domElement); };
  },[]);
  return <div ref={mountRef} style={{width:'100%',height:'100%',position:'absolute',inset:0, zIndex:0}} />;
}
