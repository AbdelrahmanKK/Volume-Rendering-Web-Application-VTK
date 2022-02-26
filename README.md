### Team Members

| Name                          | Section |  BN |
| ----------------------------- | :-----: | --: |
| Abdelrahman Khaled Isamail    |    1    |  50 |
| Mostafa Medhat Hakim          |    2    |  32 |
| Mohab Hesham Ahmed            |    2    |  34 |
| Hesham Gamal Abdelhady        |    2    |  46 |


- ### important note: our main files are:
 1. src\index.js 
 2. public\index.html
 3. public\styles.css
 4. public\usethis.jpeg



# Volume Rendering (VTK)

- The main idea of the project was to understand how VTK.js work and how to use it.
- First of all we installed node.js, react, yarn.
- Then we started running some examples from the VTK.js website and here are some screenshots:

#### 1. PiecewiseGaussianWidget:
![image](https://user-images.githubusercontent.com/61351802/147504587-72400acf-cba6-4938-b9f5-3eaae7a620fb.png)
#### 2. controlling isovalue:
![image](https://user-images.githubusercontent.com/61351802/147504697-04fefd0e-7923-44bd-9f6f-3858de494103.png)
#### 3. ImageCroppingWidget:
![image](https://user-images.githubusercontent.com/61351802/147504899-7978a7b0-6f12-4cd5-bb02-2e342f3d2bda.png)

- Then we got the idea of how mappers and actors work to produce our scene.
- At first this code was like a puzzle to us but we managed to understand it quite better.
```
const actor = vtkVolume.newInstance();
const mapper = vtkVolumeMapper.newInstance();
actor.setMapper(mapper);
```
- We found that there are two types of actors (volume actor,normal actor), and two types of mappers (volume mapper, normal mapper).
```
const actor = vtkVolume.newInstance();
const mapper = vtkVolumeMapper.newInstance();

const isoActor = vtkActor.newInstance();
const isoMapper = vtkMapper.newInstance();

actor.setMapper(mapper);
isoActor.setMapper(isoMapper);

```
- the volume actor and mapper are used for the cropping and gaussian widgets, but the normal actor and mapper are used for the isoValue (marching cubes).
- so we got that we can put cropping and gaussian widgets together using widget manager in the same mapper hence the same actor.
```
const widgetManager = vtkWidgetManager.newInstance();
widgetManager.setRenderer(renderer);

const widget = vtkImageCroppingWidget.newInstance();
const widget2 = vtkPiecewiseGaussianWidget.newInstance({
  numberOfBins: 256,
  size: [400, 150],
});

```
- then we uderstood how to read data and give it to the mapper.
```
reader.setUrl(CHEST,{loadData:true});
```
- then we made two functions one for the cropping and gaussian widgets and one for the isoValue(marching cubes).
```

function cropplan(){
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

    // Automatic switch to next preset every 5s
    
    widget2.setDataArray(dataArray.getData());
    widget2.applyOpacity(piecewiseFunction);

    widget2.setColorTransferFunction(lookupTable);
    lookupTable.onModified(() => {
      widget2.render();
      renderWindow.render();
    });
    // update crop widget
    widget.copyImageDataDescription(image);
    const cropState = widget.getWidgetState().getCroppingPlanes();
    cropState.onModified(() => {
      const planes = getCroppingPlanes(image, cropState.getPlanes());
      mapper.removeAllClippingPlanes();
      planes.forEach((plane) => {
        mapper.addClippingPlane(plane);
      });
      mapper.modified();
    });
    
    isoActor.setVisibility(false);
    actor.setVisibility(true);
    widget.setVisibility(true);
    renderer.resetCamera();

    renderer.resetCameraClippingRange();
    widgetRegistration();
    renderWindow.render();
       
}

```

```
function runIso() {
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
```

- At first we were clearing all the actors and mappers and declare them again which was very time consuming but after consulting with the TA, the problem was solved by hiding and showing the actors and mappers instead of removing them. 
- then we assigned buttons to toggel between two volumes (head,chest).



![image](https://user-images.githubusercontent.com/61351802/147886614-78b60212-43c2-45db-a8ed-33b08ad38b9e.png)



- then we started to add some controlles to control the scene like:
   1. Cropping widget controls:



   ![image](https://user-images.githubusercontent.com/61351802/147886593-1d864ea4-e6a2-4aca-931e-1bd95279d415.png)
   
   
   
   2. Iso value control:



   ![image](https://user-images.githubusercontent.com/61351802/147886646-8a83fac0-885a-442f-8b9e-40a4fdcef8f8.png)
   
   
   
   3. Gaussian controls:



   ![image](https://user-images.githubusercontent.com/61351802/147886677-aa33e1ea-e63b-42a8-a1d5-d297a4b7b625.png)


- Then we started to design our website: 

   1. home screen:

![image](https://user-images.githubusercontent.com/61351802/147886780-aac70b00-38db-4b4a-aba6-437baff8d5c4.png)

   2. Chest workspace:



![image](https://user-images.githubusercontent.com/61351802/147886838-9455c5f7-86ae-4c5c-98a1-a16e72b0870a.png)

   3. Head workspace:
   
   
![image](https://user-images.githubusercontent.com/61351802/147886869-c412a9f3-e481-4479-bcce-8ed4a91f282e.png)

   

- In terms of style, we tried to choose a convenient one to our project and we managed to emped the css file , html file and js file using some resorces from the internet.

## Issues we faced:
1. it was hard to understand VTK and modify the examples to match the requirements of the project.
2. it was hard to understand HTML , Css and js for the first time, which took us most of the time.
3. Sometimes when running the code there are no errors shown but the website doesn't work so we had to trace all the code back multible times.
4. we tried to load the head and chest data one single time to make the website faster, but we couldn't.
5. when we switch between head and chest, some parts of the volume doesn't show properly but when we adjust the cutting widget, every thing works fine.



## Final thoughts:
- the project had a lot of advantages to us as students as well as engineers like time mangaments, self learning , html+css+js+vtk+react concepts ..etc

- when we settle down and look back to our journey with this task, we supposed that it would be much easier . but we found that it is a real challenge .but  we managed to make some progress, week by week  and day after day . And it was amazing feeling that we achieved good results eventually.




