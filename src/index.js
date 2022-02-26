//team members:

      // abdelrahman khaled


      // moustafa medhat 


      // hisham gamal abdelhadi


      // mohab hisham 




import { vec3, quat, mat4 } from 'gl-matrix';

import '@kitware/vtk.js/favicon';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import '@kitware/vtk.js/Rendering/Profiles/Volume';
import '@kitware/vtk.js/Rendering/Profiles/Glyph';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager';
import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';
import vtkImageCroppingWidget from '@kitware/vtk.js/Widgets/Widgets3D/ImageCroppingWidget';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane';


// Load the rendering pieces we want to use (for both WebGL and WebGPU)

// Force DataAccessHelper to have access to various data source
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper';

import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkImageMarchingCubes from '@kitware/vtk.js/Filters/General/ImageMarchingCubes';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import state from '@kitware/vtk.js/Widgets/Widgets3D/ImageCroppingWidget/state';


// Load the rendering pieces we want to use (for both WebGL and WebGPU)

import vtkPiecewiseGaussianWidget from '@kitware/vtk.js/Interaction/Widgets/PiecewiseGaussianWidget';

// Force the loading of HttpDataAccessHelper to support gzip decompression

import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';

// Force the loading of HttpDataAccessHelper to support gzip decompression
const CHEST = "https://kitware.github.io/vtk-js/data/volume/LIDC2.vti";
const HEAD = "https://kitware.github.io/vtk-js/data/volume/headsq.vti";
const __BASE_PATH__ = "https://kitware.github.io/vtk-js";


const cropwidget =  //copping planes and gaussian controlles
`
<div class="cropContainer">
<ul>
<li class="croptext">visibility</li>
<li class="cropchek">
  <input class='flag' data-name="visibility" type="checkbox" checked />
</li>
</ul>
<ul>
<li class="croptext">context Visibility</li>
<li class="cropchek">
  <input class='flag' data-name="contextVisibility" type="checkbox" checked />
</li>
</ul>
<ul>
<li class="croptext">Gaussian</li>
<li class="cropchek">
  <input class='noguss' type="checkbox" checked />
</li>
</ul>
</div>

`;

const isocontrolWidget =      //iso value(marching cubes) controlles
 `     

<div class="isoContainer">
<ul>
<li class = "isotext">Iso value</li>
<li><input class='isoValue' type="range" min="0.0" max="1.0" step="0.05" value="0.0" /></li>
</ul>
</div>
`

const cropisowidget =       //the buttons that toggel between isoVolue and cutting widget
 `
<div class="dataContainer">
<ul>
  <li><button class="isoSelect">Marching</button></li>
  <li><button class="cuttingPlane">cutting</button></li>
</ul>
</div>

`

const nav =              //the navigation bar
` 
<div class="navbar">
		<div class="inner_navbar">
			<div class="logo">
				<a href="#">VTK <span>Project</span></a>
			</div>
			<div class="menu">
				<ul>
					<li><button class="loadHome" >Home</button></li>
					<li><button class="chest" >Chest</button></li>
					<li><button class="head">Head</button></li>
				
				</ul>
			</div>
		</div>
	</div>
`
const homecontent =   //containes the home page
`
<div>
<img src="usethis.jpeg" style="width:100%;hight:100%;">
</div>
`


// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
  background: [0, 0, 0],

});
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();
const apiRenderWindow = fullScreenRenderer.getApiSpecificRenderWindow();

global.renderer = renderer;
global.renderWindow = renderWindow;

// ----------------------------------------------------------------------------
// 2D overlay rendering
// ----------------------------------------------------------------------------



const overlaySize = 15;
const overlayBorder = 2;
const overlay = document.createElement('div');
overlay.style.position = 'absolute';
overlay.style.width = `${overlaySize}px`;
overlay.style.height = `${overlaySize}px`;
overlay.style.border = `solid ${overlayBorder}px red`;
overlay.style.borderRadius = '50%';
overlay.style.left = '-100px';
overlay.style.pointerEvents = 'none';
document.querySelector('body').appendChild(overlay);


//the widget controlles the transfer function

const widgetContainer = document.createElement('div');
widgetContainer.style.position = 'absolute';
widgetContainer.style.top = '210px';
widgetContainer.style.left = '5px';
widgetContainer.style.background = 'rgba(255, 255, 255, 0.3)';
widgetContainer.style.visibility = 'hidden';
document.querySelector('body').appendChild(widgetContainer);

// Create Label for preset
const labelContainer = document.createElement('div');
labelContainer.style.position = 'absolute';
labelContainer.style.top = '185px';
labelContainer.style.left = '250px';
labelContainer.style.width = '200px';
labelContainer.style.color = 'white';
labelContainer.style.textAlign = 'right';
labelContainer.style.userSelect = 'none';
labelContainer.style.cursor = 'pointer';
labelContainer.style.visibility = 'hidden';
document.querySelector('body').appendChild(labelContainer);

//navigation bar container
const navBar = document.createElement('div');
navBar.style.width= '100%';
	navBar.style.height= '60px';
	navBar.style.background= '#090f1b';
	navBar.style.position= 'fixed';
	navBar.style.top= '0';
	navBar.style.left= '0';
	navBar.style.padding= '0 25px';
  navBar.style.zIndex='1';
document.querySelector('body').appendChild(navBar);
navBar.innerHTML=nav;

//buttons change between iso and cropping widget
const isocrop = document.createElement('div');
isocrop.style.position= 'absolute'; 
isocrop.style.right= '25px';
isocrop.style.top= '65px'; 
isocrop.style.borderRadius= '5px'; 
isocrop.style.listStyle = 'none'; 
isocrop.style.padding= '5px 10px'; 
isocrop.style.margin= '0px'; 
isocrop.style.display= 'block'; 
isocrop.style.border= '1px solid black';
isocrop.style.overflow= 'auto';
isocrop.style.alignItems= 'center';
isocrop.style.visibility='hidden';
document.querySelector('body').appendChild(isocrop);
isocrop.innerHTML= cropisowidget;

// controller of the iso value
const isocontrol = document.createElement('div');
isocontrol.style.position= 'absolute'; 
isocontrol.style.left= '25px';
isocontrol.style.top= '65px'; 
isocontrol.style.background = '#090f1b'; 
isocontrol.style.borderRadius= '5px'; 
isocontrol.style.listStyle = 'none'; 
isocontrol.style.padding= '5px 10px'; 
isocontrol.style.margin= '0px'; 
isocontrol.style.display= 'block'; 
isocontrol.style.border= '1px solid black';
isocontrol.style.alignItems= 'center';
isocontrol.style.overflow= 'auto';
document.querySelector('body').appendChild(isocontrol);
isocontrol.innerHTML= isocontrolWidget;

// controller of the crop widget 
const cropControl = document.createElement('div');
cropControl.style.position= 'absolute'; 
cropControl.style.left= '25px';
cropControl.style.top= '65px'; 
cropControl.style.background = '#090f1b'; 
cropControl.style.borderRadius= '5px'; 
cropControl.style.listStyle = 'none'; 
cropControl.style.padding= '5px 10px'; 
cropControl.style.margin= '0px'; 
cropControl.style.display= 'block'; 
cropControl.style.border= '1px solid black';
cropControl.style.overflow= 'auto';
//test.style.visibility = 'hidden';
document.querySelector('body').appendChild(cropControl);
cropControl.innerHTML= cropwidget;

//home bage container
const homebage = document.createElement('div');
homebage.style.position= 'fixed'; 
homebage.style.top= '20px'; 
homebage.style.background = '#090f1b'; 
homebage.style.listStyle = 'none'; 
homebage.style.margin= '0px'; 
homebage.style.display= 'block'; 
homebage.style.overflow= 'auto';
homebage.style.alignItems= 'center';
homebage.style.visibility='visible';
document.querySelector('body').appendChild(homebage);
homebage.innerHTML= homecontent;


let presetIndex = 1;
const globalDataRange = [0, 255];
const lookupTable = vtkColorTransferFunction.newInstance();

function changePreset(delta = 1) {
  presetIndex =
    (presetIndex + delta + vtkColorMaps.rgbPresetNames.length) %
    vtkColorMaps.rgbPresetNames.length;
  lookupTable.applyColorMap(
    vtkColorMaps.getPresetByName(vtkColorMaps.rgbPresetNames[presetIndex])
  );
  lookupTable.setMappingRange(...globalDataRange);
  lookupTable.updateRange();
  labelContainer.innerHTML = vtkColorMaps.rgbPresetNames[presetIndex];
}

let intervalID = null;
function stopInterval() {
  if (intervalID !== null) {
    clearInterval(intervalID);
    intervalID = null;
  }
}

labelContainer.addEventListener('click', (event) => {
  if (event.pageX < 200) {
    stopInterval();
    changePreset(-1);
  } else {
    stopInterval();
    changePreset(1);
  }
});


// ----------------------------------------------------------------------------
// Widget manager
// ----------------------------------------------------------------------------

const widgetManager = vtkWidgetManager.newInstance(); //creat widget manager
widgetManager.setRenderer(renderer);

const cropWidget = vtkImageCroppingWidget.newInstance();  //cropping planes widget
const gaussWidget = vtkPiecewiseGaussianWidget.newInstance({   //gaussian widget
  numberOfBins: 256,
  size: [400, 150],
});

gaussWidget.updateStyle({
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  histogramColor: 'rgba(100, 100, 100, 0.5)',
  strokeColor: 'rgb(0, 0, 0)',
  activeColor: 'rgb(255, 255, 255)',
  handleColor: 'rgb(50, 150, 50)',
  buttonDisableFillColor: 'rgba(255, 255, 255, 0.5)',
  buttonDisableStrokeColor: 'rgba(0, 0, 0, 0.5)',
  buttonStrokeColor: 'rgba(0, 0, 0, 1)',
  buttonFillColor: 'rgba(255, 255, 255, 1)',
  strokeWidth: 2,
  activeStrokeWidth: 3,
  buttonStrokeWidth: 1.5,
  handleWidth: 3,
  iconSize: 20, // Can be 0 if you want to remove buttons (dblClick for (+) / rightClick for (-))
  padding: 10,
});

fullScreenRenderer.setResizeCallback(({ width, height }) => {
  gaussWidget.setSize(Math.min(450, width - 10), 150);
});

const piecewiseFunction = vtkPiecewiseFunction.newInstance();



function widgetRegistration(e) {
  const action = e ? e.currentTarget.dataset.action : 'addWidget';
  const viewWidget = widgetManager[action](cropWidget);
  if (viewWidget) {
    viewWidget.setDisplayCallback((coords) => {
      overlay.style.left = '-100px';
      if (coords) {
        const [w, h] = apiRenderWindow.getSize();
        overlay.style.left = `${Math.round(
          (coords[0][0] / w) * window.innerWidth -
            overlaySize * 0.5 -
            overlayBorder
        )}px`;
        overlay.style.top = `${Math.round(
          ((h - coords[0][1]) / h) * window.innerHeight -
            overlaySize * 0.5 -
            overlayBorder
        )}px`;
      }
    });

    renderer.resetCamera();
    renderer.resetCameraClippingRange();
  }
  widgetManager.enablePicking();
  renderWindow.render();
}

// Initial widget register
widgetRegistration();

// ----------------------------------------------------------------------------
// Volume rendering
// ----------------------------------------------------------------------------

const reader = vtkHttpDataSetReader.newInstance({ fetchGzip: true });

const actor = vtkVolume.newInstance();  //actor of crop and gaussian widgets
const mapper = vtkVolumeMapper.newInstance();  //mapper of crop and gaussian widgets

const isoActor = vtkActor.newInstance(); //actor of isoValue(marching cubes)
const isoMapper = vtkMapper.newInstance();  //mapper of isoValue(marching cubes)

const marchingCube = vtkImageMarchingCubes.newInstance({
  contourValue: 0.0,
  computeNormals: true,
  mergePoints: true,
});
mapper.setSampleDistance(1.1);
actor.setMapper(mapper);   //connect mapper to actor
isoActor.setMapper(isoMapper);  //connect isomapper to isoactor
isoMapper.setInputConnection(marchingCube.getOutputPort());  //set the input of isomapper

actor.getProperty().setRGBTransferFunction(0, lookupTable);
actor.getProperty().setScalarOpacity(0, piecewiseFunction);
actor.getProperty().setInterpolationTypeToFastLinear();


renderer.getActiveCamera().set({ position: [0, 1, 0], viewUp: [0, 0, -1] });
renderer.getActiveCamera().elevation(20);

mapper.setInputConnection(reader.getOutputPort()); //set input to mapper

// -----------------------------------------------------------
// Get data
// -----------------------------------------------------------

function getCroppingPlanes(imageData, ijkPlanes) {
  const rotation = quat.create();
  mat4.getRotation(rotation, imageData.getIndexToWorld());

  const rotateVec = (vec) => {
    const out = [0, 0, 0];
    vec3.transformQuat(out, vec, rotation);
    return out;
  };

  const [iMin, iMax, jMin, jMax, kMin, kMax] = ijkPlanes;
  const origin = imageData.indexToWorld([iMin, jMin, kMin]);
  // opposite corner from origin
  const corner = imageData.indexToWorld([iMax, jMax, kMax]);
  return [
    // X min/max
    vtkPlane.newInstance({ normal: rotateVec([1, 0, 0]), origin }),
    vtkPlane.newInstance({ normal: rotateVec([-1, 0, 0]), origin: corner }),
    // Y min/max
    vtkPlane.newInstance({ normal: rotateVec([0, 1, 0]), origin }),
    vtkPlane.newInstance({ normal: rotateVec([0, -1, 0]), origin: corner }),
    // X min/max
    vtkPlane.newInstance({ normal: rotateVec([0, 0, 1]), origin }),
    vtkPlane.newInstance({ normal: rotateVec([0, 0, -1]), origin: corner }),
  ];
}
reader.setUrl(CHEST,{loadData:true}).then(() => {     //initial reader data
  isocrop.style.visibility='hidden';
  homeselect();
  });
  
function loadHead(){                                
  reader.setUrl(HEAD,{loadData:true}).then(() => {     //change reader data
    homebage.style.visibility='hidden';
    isocrop.style.visibility='visible';
    runIso();   //load iso value
    cropplan();  //load cropping planes
    });

}

function loadChest(){
  reader.setUrl(CHEST,{loadData:true}).then(() => {
    homebage.style.visibility='hidden';
    isocrop.style.visibility='visible';
    runIso();  //load iso value
    cropplan();  //load cropping planes
    
    });

  
}



renderer.addActor(isoActor);   //add isoactor to renderer
   //add actor to renderer

function cropplan(){                //function load the cropping planes
  cropControl.style.visibility='visible';
  const value = !!cropControl.querySelector('.noguss').checked;
  
  gausseanChange(value);
  
    const image = reader.getOutputData();
    const dataArray = image.getPointData().getScalars();
    const dataRange = dataArray.getRange();
    globalDataRange[0] = dataRange[0];
    globalDataRange[1] = dataRange[1];

    // Update Lookup table
    changePreset();


    
    gaussWidget.setDataArray(dataArray.getData());
    gaussWidget.applyOpacity(piecewiseFunction);

    gaussWidget.setColorTransferFunction(lookupTable);
    lookupTable.onModified(() => {
      gaussWidget.render();
      renderWindow.render();
    });
    // update crop widget
   
    const cropState = cropWidget.getWidgetState().getCroppingPlanes();
    cropState.onModified(() => {
      const planes = getCroppingPlanes(image, cropState.getPlanes());
      mapper.removeAllClippingPlanes();
      planes.forEach((plane) => {
        mapper.addClippingPlane(plane);
      });
      mapper.modified();
    });
    cropWidget.copyImageDataDescription(image);
    isoActor.setVisibility(false);
    actor.setVisibility(true);
    cropWidget.setVisibility(true);
    renderer.resetCamera();
    renderer.addVolume(actor);  
    renderer.resetCameraClippingRange();
    widgetRegistration();
    renderWindow.render();  //to render the scene
       
}

gaussWidget.addGaussian(0.425, 0.5, 0.2, 0.3, 0.2);
gaussWidget.addGaussian(0.75, 1, 0.3, 0, 0);

gaussWidget.setContainer(widgetContainer);
gaussWidget.bindMouseListeners();



gaussWidget.onAnimation((start) => {
  if (start) {
    renderWindow.getInteractor().requestAnimation(gaussWidget);
  } else {
    renderWindow.getInteractor().cancelAnimation(gaussWidget);
  }
});

gaussWidget.onOpacityChange(() => {
  gaussWidget.applyOpacity(piecewiseFunction);
  if (!renderWindow.getInteractor().isAnimating()) {
    renderWindow.render();
  }
});

// ----------------------------------------------------------------------------
// Expose variable to global namespace
// ----------------------------------------------------------------------------




function updateIsoValue(e) {
  const isoValue = Number(e.target.value);
  marchingCube.setContourValue(isoValue);
  renderWindow.render();
}

marchingCube.setInputConnection(reader.getOutputPort());

function runIso() {                                     //function to run the iso value
  const data = reader.getOutputData();
  const dataRange = data.getPointData().getScalars().getRange();
  const firstIsoValue = (dataRange[0] + dataRange[1]) / 3;

  const el = document.querySelector('.isoValue');
  el.setAttribute('min', dataRange[0]);
  el.setAttribute('max', dataRange[1]);
  el.setAttribute('value', firstIsoValue);
  el.addEventListener('input', updateIsoValue);

  marchingCube.setContourValue(firstIsoValue);


  renderer.resetCamera();
  renderWindow.render();

}
// -----------------------------------------------------------
// UI control handling
// -----------------------------------------------------------

// fullScreenRenderer.addController(controlPanel);

function updateFlag(e) {
  const value = !!e.target.checked;
  const name = e.currentTarget.dataset.name;
  cropWidget.set({ [name]: value }); 

  widgetManager.enablePicking();
  renderWindow.render();
}
function updateFlag2(value=Boolean,name) {
  
  
  cropWidget.set({ [name]: value }); 

  widgetManager.enablePicking();
  renderWindow.render();
}


function updateGussean(e) {       //check wether to show gaussian or not
  const value = !!e.target.checked;
  
 gausseanChange(value);

  widgetManager.enablePicking();
  renderWindow.render();
}


function gausseanChange(value=Boolean){
   if(value){
      gausseanOn();

   }else{

    cancelguss();
   }

}


function cancelguss(){                          //function thet removes gauss
  widgetContainer.style.visibility = 'hidden';
  labelContainer.style.visibility = 'hidden';
  homebage.style.visibility='hidden';
  actor.removeAllTextures();
  const value = !!cropControl.querySelector('.flag').checked;
  const name=cropControl.querySelector('.flag').dataset.name;
  updateFlag2(value,name);
  const ctfun = vtkColorTransferFunction.newInstance();
ctfun.addRGBPoint(0, 85 / 255.0, 0, 0);
ctfun.addRGBPoint(95, 1.0, 1.0, 1.0);
ctfun.addRGBPoint(225, 0.66, 0.66, 0.5);
ctfun.addRGBPoint(255, 0.9, 0.3, 0.5);
const ofun = vtkPiecewiseFunction.newInstance();
ofun.addPoint(0.0, 0.0);
ofun.addPoint(255.0, 1.0);
actor.getProperty().setRGBTransferFunction(0, ctfun);
actor.getProperty().setScalarOpacity(0, ofun);
actor.getProperty().setScalarOpacityUnitDistance(0, 3.0);
actor.getProperty().setInterpolationTypeToLinear();
actor.getProperty().setUseGradientOpacity(0, true);
actor.getProperty().setGradientOpacityMinimumValue(0, 2);
actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
actor.getProperty().setGradientOpacityMaximumValue(0, 20);
actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
actor.getProperty().setShade(true);
actor.getProperty().setAmbient(0.2);
actor.getProperty().setDiffuse(0.7);
actor.getProperty().setSpecular(0.3);
actor.getProperty().setSpecularPower(8.0);

isoActor.setVisibility(false);
actor.setVisibility(true);

widgetRegistration();
renderWindow.render();

 
}

function homeselect(){                         //function to load home page
  widgetContainer.style.visibility = 'hidden';
  labelContainer.style.visibility = 'hidden';
  isocontrol.style.visibility= 'hidden';
  cropControl.style.visibility= 'hidden';
  isocrop.style.visibility='hidden'
  homebage.style.visibility='visible';
  actor.setVisibility(false);
  isoActor.setVisibility(false);
  cropWidget.setVisibility(false);
  renderWindow.render();

}

function isoswitch(){                            //function to show iso and it's controlles
  widgetContainer.style.visibility = 'hidden';
  labelContainer.style.visibility = 'hidden';
  isocontrol.style.visibility= 'visible';
  cropControl.style.visibility= 'hidden';
  homebage.style.visibility='hidden';
  actor.setVisibility(false);
  isoActor.setVisibility(true);
  cropWidget.setVisibility(false);

  renderWindow.render();

}

function gausseanOn(){
  labelContainer.style.visibility = 'visible';
  widgetContainer.style.visibility = 'visible';
  homebage.style.visibility='hidden';
  actor.removeAllTextures();
  const value = !!cropControl.querySelector('.flag').checked;
  const name=cropControl.querySelector('.flag').dataset.name;
  updateFlag2(value,name);

  actor.getProperty().setRGBTransferFunction(0, lookupTable);
  actor.getProperty().setScalarOpacity(0, piecewiseFunction);
  actor.getProperty().setInterpolationTypeToFastLinear();
  
  isoActor.setVisibility(false);
  actor.setVisibility(true);
  

  widgetRegistration();
  renderWindow.render();

}

function planswitch(){
  homebage.style.visibility='hidden';
  const value = !!cropControl.querySelector('.noguss').checked;
  
  gausseanChange(value);
  isoActor.setVisibility(false);
  actor.setVisibility(true);
  cropWidget.setVisibility(true);
  isocontrol.style.visibility= 'hidden';
  cropControl.style.visibility= 'visible';

  widgetRegistration();
  renderWindow.render();
  
}

const elems = document.querySelectorAll('.flag');    //checkboxes that controlles the cutting widget
for (let i = 0; i < elems.length; i++) {
  elems[i].addEventListener('change', updateFlag);
}

const isobuttons = document.querySelector('.isoSelect');  //button to run iso value

isobuttons.addEventListener('click', isoswitch);


const cutbuttons = document.querySelector('.cuttingPlane');  //button to run cutting planes

cutbuttons.addEventListener('click', planswitch);

const gussbutton = document.querySelector('.noguss');   //checkbox to hide or show gaussian

gussbutton.addEventListener('change', updateGussean);


const headslect = document.querySelector('.head');  //button to load head data

headslect.addEventListener('click', loadHead);



const chestslect = document.querySelector('.chest');  //button to load chest data

chestslect.addEventListener('click', loadChest);


const goHome = document.querySelector('.loadHome');  //home button

goHome.addEventListener('click', homeselect);

