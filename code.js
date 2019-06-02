(function animationPlayer() {
  const listOfFrames = document.getElementById('list-of-frames');
  const arrayOflistFrames = [1];
  let countOfFrames = 1;
  const coordinatesForFrame = [];
  const showCurrentFrame = [1];
  const imagesForPreview = new Map();

  // canvases and context to them
  const canvasMainElement = document.getElementById('canvas-draw');
  const ctxMain = canvasMainElement.getContext('2d');
  const buttonAddFrame = document.getElementById('button-add-new-frame');
  const newLi = listOfFrames.innerHTML;

  function pictureOnFrameAfterButtonAddNewFrame(e) {
    const childsOfUl = Array.from(e.path[2].children[0].children);
    const dsa = childsOfUl.filter(
      elem => elem.classList[1] === 'yellow-border',
    );
    const canvasCurrentFrameElement = dsa[0].children[4];
    const ctxCurrentFrame = canvasCurrentFrameElement.getContext('2d');
    coordinatesForFrame.forEach((num) => {
      if (
        num.numberFrame === showCurrentFrame[0]
        && Number(dsa[0].innerText) === showCurrentFrame[0]
      ) {
        ctxCurrentFrame.fillRect(num.x, num.y, 1.3, 1.3);
      }
    });
  }

  function drawInCanvasElement() {
    function drawWithMouseMove(e) {
      const childsOfUl = Array.from(
        e.path[1].children[1].children[0].children[0].children,
      );
      const arrayOfYellowBorder = [];
      childsOfUl.forEach((elem) => {
        if (elem.classList[1] === 'yellow-border') { arrayOfYellowBorder.push(elem); }
      });
      const ctxForCurrentLi = arrayOfYellowBorder[0].children[4].getContext(
        '2d',
      );
      ctxMain.fillRect(e.offsetX - 5, e.offsetY - 5, 16, 16);
      ctxForCurrentLi.fillRect(e.offsetX / 12, e.offsetY / 12, 1.3, 1.3);
      coordinatesForFrame.push(showCurrentFrame[0], {
        numberFrame: showCurrentFrame[0],
        x: e.offsetX / 12,
        y: e.offsetY / 12,
      });
    }

    function saveDataUrls(e) {
      const childsOfUl = Array.from(
        e.path[1].children[1].children[0].children[0].children,
      );
      const arrayOfYellowBorder = [];
      childsOfUl.forEach((elem) => {
        if (elem.classList[1] === 'yellow-border') { arrayOfYellowBorder.push(elem); }
      });
      const picture = e.path[1].children[2].toDataURL('image/png');
      const numberOfCurrentFrame = Number(arrayOfYellowBorder[0].innerText);
      imagesForPreview.set(numberOfCurrentFrame, picture);
    }

    canvasMainElement.addEventListener('mousedown', () => {
      canvasMainElement.addEventListener('mousemove', drawWithMouseMove);
      canvasMainElement.addEventListener('mouseup', saveDataUrls);
      canvasMainElement.addEventListener('mouseup', (e) => {
        canvasMainElement.removeEventListener('mousemove', drawWithMouseMove);
        // change preview
        const childsOfUl = Array.from(
          e.path[1].children[1].children[0].children[0].children,
        );
        const arrayOfYellowBorder = [];
        childsOfUl.forEach((elem) => {
          if (elem.classList[1] === 'yellow-border') { arrayOfYellowBorder.push(+elem.innerText); }
        });
        document.getElementById('preview').innerHTML = '<img id="image-preview" width="312" height="250">';
        document
          .getElementById('image-preview')
          .setAttribute('src', imagesForPreview.get(arrayOfYellowBorder[0]));
      });

      canvasMainElement.addEventListener('mouseleave', () => {
        canvasMainElement.removeEventListener('mousemove', drawWithMouseMove);
      });
      canvasMainElement.addEventListener('mouseout', () => {
        canvasMainElement.removeEventListener('mousemove', drawWithMouseMove);
      });
    });
  }

  function defineCurrentFrame() {
    function eventListenerForUlWhichChangeCurrentFrame(e) {
      if (e.target.className === 'canvas-frame') {
        if (e.path[1].classList[1] === 'gray-border') {
          // change color, if li element is current
          e.path[1].classList.remove('gray-border');
          e.path[1].classList.add('yellow-border');
          const childrenOfCurrentLi = Array.from(e.path[1].children);
          for (let i = 0; i < childrenOfCurrentLi.length - 1; i += 1) {
            childrenOfCurrentLi[i].classList.remove('gray-frame-items');
            childrenOfCurrentLi[i].classList.add('yellow-frame-items');
          }
          // change color, if li element was previos
          const previousLiElement = e.path[2].children[showCurrentFrame[0] - 1];
          previousLiElement.classList.remove('yellow-border');
          previousLiElement.classList.add('gray-border');
          const childrenOfPreviousLiElement = Array.from(
            previousLiElement.children,
          );
          for (let i = 0; i < childrenOfPreviousLiElement.length - 1; i += 1) {
            childrenOfPreviousLiElement[i].classList.remove(
              'yellow-frame-items',
            );
            childrenOfPreviousLiElement[i].classList.add('gray-frame-items');
          }
        }
        showCurrentFrame.pop();
        showCurrentFrame.push(Number(e.path[1].innerText));
        if (coordinatesForFrame.indexOf(Number(e.path[1].innerText)) === -1) {
          ctxMain.clearRect(0, 0, 750, 600);
        }
        if (coordinatesForFrame.indexOf(Number(e.path[1].innerText)) !== -1) {
          ctxMain.clearRect(0, 0, 750, 600);
          const currentCanvasElement = e.path[0];
          const ctxcurrentCanvasElement = currentCanvasElement.getContext('2d');
          coordinatesForFrame.forEach((coordinate) => {
            if (coordinate.numberFrame === Number(e.path[1].innerText)) {
              ctxcurrentCanvasElement.fillRect(
                coordinate.x,
                coordinate.y,
                1.3,
                1.3,
              );
              ctxMain.fillRect(coordinate.x * 12, coordinate.y * 12, 16, 16);
            }
          });
        }
      }
    }

    listOfFrames.addEventListener(
      'click',
      eventListenerForUlWhichChangeCurrentFrame,
    );
  }

  // Work with frames which add/remove/dublicate/move
  function addFrames() {
    function addNewFrame(e) {
      listOfFrames.innerHTML += newLi;
      countOfFrames += 1;
      arrayOflistFrames.push(countOfFrames);
      const numberOfFrame = document.getElementsByClassName('number-of-frame');
      numberOfFrame[numberOfFrame.length - 1].innerText = countOfFrames;
      pictureOnFrameAfterButtonAddNewFrame(e);
    }

    buttonAddFrame.addEventListener('click', addNewFrame);
  }

  function updateNumbersOfFrames(e) {
    const childrensOfUl = Array.from(e.path[3].children);
    for (let i = 0; i < childrensOfUl.length; i += 1) {
      childrensOfUl[i].children[0].children[0].innerHTML = i + 1;
    }
  }

  function deleteFrame() {
    listOfFrames.addEventListener('click', (e) => {
      if (e.target.className === 'fas fa-trash-alt') {
        countOfFrames -= 1;
        coordinatesForFrame.forEach((coordinate, i) => {
          if (
            coordinatesForFrame[i].numberFrame === Number(e.path[2].innerText)
          ) {
            coordinatesForFrame.splice(i, 1);
          }
        });
        imagesForPreview.delete(+Number(e.path[2].innerText));
        e.path[3].removeChild(e.path[2]);
        updateNumbersOfFrames(e);
      }
    });
  }

  function dublicateFrame() {
    function copy(e) {
      if (e.target.className === 'fas fa-copy') {
        countOfFrames += 1;
        arrayOflistFrames.push(countOfFrames);

        const frameElement = e.target.parentElement.parentElement;
        const frameElementClone = e.target.parentElement.parentElement.cloneNode(
          true,
        );

        // change number of frame
        frameElementClone.children[0].children[0].innerHTML = +frameElementClone
          .children[0].children[0].innerHTML + 1;
        // change color of dublicate frame
        frameElementClone.classList.remove('yellow-border');
        frameElementClone.classList.add('gray-border');
        const childernesOfDublicateFrames = Array.from(
          frameElementClone.children,
        );
        for (let i = 0; i < childernesOfDublicateFrames.length - 1; i += 1) {
          childernesOfDublicateFrames[i].classList.remove('yellow-frame-items');
          childernesOfDublicateFrames[i].classList.add('gray-frame-items');
        }
        // add dublicate frame
        frameElement.parentNode.insertBefore(
          frameElementClone,
          frameElement.nextSibling,
        );
        frameElement.nextElementSibling = frameElement;
        const numberOfCopiedFrame = +e.path[2].innerText;
        const coordinatesForCloned = [];
        coordinatesForFrame.forEach((elem) => {
          if (elem === numberOfCopiedFrame) coordinatesForCloned.push(elem + 1);
          if (elem.numberFrame === numberOfCopiedFrame) { coordinatesForCloned.push(elem); }
        });
        // change number of frame on another frames
        updateNumbersOfFrames(e);
      }
    }

    listOfFrames.addEventListener('click', copy);
  }

  // change animation on preview dependent of fps
  let number = 0;
  function animationFps() {
    const inputRangeOnPreview = document.getElementById('input-range-fps');
    let fpsOnPreview = Number(document.getElementById('input-range-fps').value);

    function forAnimation(e, width, height) {
      const childsOfUl = Array.from(
        e.path[3].children[1].children[0].children[0].children,
      );
      const interval = setInterval(() => {
        if (number === childsOfUl.length) number = 0;
        setTimeout(() => {
          document.getElementById('preview').innerHTML = `<img id="image-preview" width="${width}" height="${height}">`;
          document
            .getElementById('image-preview')
            .setAttribute('src', imagesForPreview.get(number));
          if (fpsOnPreview === 0) clearInterval(interval);
        }, 1000);
        number += 1;
      }, 1000 / fpsOnPreview);
    }

    inputRangeOnPreview.addEventListener('click', (e) => {
      fpsOnPreview = Number(document.getElementById('input-range-fps').value);
      if (fpsOnPreview > 0) {
        forAnimation(e, 312, 250);
      }
    });
  }

  function fullScreen() {
    const preview = document.getElementById('preview');
    preview.addEventListener('dblclick', () => {
      preview.requestFullscreen();
    });
  }

  function yellowColorForFirstFrameAfterLoadPage() {
    const firstFrame = document.getElementById('frame');
    const elementsOfFirstFrame = Array.from(
      document.getElementsByClassName('gray-frame-items'),
    );

    firstFrame.classList.remove('gray-border');
    firstFrame.classList.add('yellow-border');
    elementsOfFirstFrame.forEach((e) => {
      e.classList.remove('gray-frame-items');
      e.classList.add('yellow-frame-items');
    });
  }

  // call functions
  drawInCanvasElement();
  addFrames();
  deleteFrame();
  dublicateFrame();
  defineCurrentFrame();
  animationFps();
  yellowColorForFirstFrameAfterLoadPage();
  fullScreen();
}());
