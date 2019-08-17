import '@tensorflow/tfjs'
import * as canvas from 'canvas'
import * as faceapi from 'face-api.js'

const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

let loadonce = true
async function load () {
  if (loadonce) {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('/usr/src/app/weights')
    await faceapi.nets.faceLandmark68Net.loadFromDisk('/usr/src/app/weights')
    await faceapi.nets.faceRecognitionNet.loadFromDisk('/usr/src/app/weights')
    loadonce = false
  }
}

export async function getFaces (filepath) {
  await load()
  const img = await canvas.loadImage(filepath)
  const results = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors()
  return results
}
