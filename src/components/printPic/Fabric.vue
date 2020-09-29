<template>
  <div class="tui-image-editor-controls">
    <ul class="menu">
      <!--<li class="menu-item" id="btn-remove-active-object">移除面板</li>-->
      <li class="menu-item" id="btn-draw-line">画笔</li>
      <li class="menu-item" id="btn-draw-shape">形状</li>
      <li class="menu-item disabled" id="btn-undo">撤销</li>
      <li class="menu-item disabled" id="btn-redo">重做</li>
      <li class="menu-item" id="btn-clear-objects">清除</li>
      <!--<li class="menu-item" id="btn-text">文字</li>-->
    </ul>
    <div class="sub-menu-container" id="crop-sub-menu">
      <ul class="menu">
        <li class="menu-item" id="btn-apply-crop">Apply(应用)</li>
        <li class="menu-item" id="btn-cancel-crop">Cancel(取消)</li>
      </ul>
    </div>
    <div class="sub-menu-container" id="flip-sub-menu">
      <ul class="menu">
        <li class="menu-item" id="btn-flip-x">FlipX(左右翻转)</li>
        <li class="menu-item" id="btn-flip-y">FlipY(上下翻转)</li>
        <li class="menu-item" id="btn-reset-flip">Reset(重置)</li>
        <li class="menu-item close">Close(关闭)</li>
      </ul>
    </div>
    <div class="sub-menu-container" id="rotation-sub-menu">
      <ul class="menu">
        <li class="menu-item" id="btn-rotate-clockwise">Clockwise(30)(顺时针30度)</li>
        <li class="menu-item" id="btn-rotate-counter-clockwise">Counter-Clockwise(-30)(逆时针30度)</li>
        <li class="menu-item no-pointer"><label>Range input(范围)<input id="input-rotation-range" type="range" min="-360" value="0" max="360"></label></li>
        <li class="menu-item close">Close(关闭)</li>
      </ul>
    </div>
    <div class="sub-menu-container menu" id="draw-line-sub-menu" style="display: block;">
      <ul class="menu">
        <li class="menu-item">
          <label><input type="radio" name="select-line-type" value="freeDrawing" checked="checked"> Free drawing(自由画笔)</label>
          <label><input type="radio" name="select-line-type" value="lineDrawing"> Straight line(画直线)</label>
        </li>
        <li class="menu-item">
          <div id="tui-brush-color-picker">选择颜色</div>
        </li>
        <li class="menu-item"><label class="menu-item no-pointer">Brush width(画笔宽)<input id="input-brush-width-range" type="range" min="1" max="3" value="2"></label></li>
        <li class="menu-item close">关闭</li>
      </ul>
    </div>
    <div class="sub-menu-container" id="draw-shape-sub-menu">
      <ul class="menu">
        <li class="menu-item">
          <label><input type="radio" name="select-shape-type" value="rect" checked="checked"> rect(方形)</label>
          <label><input type="radio" name="select-shape-type" value="circle"> circle(圆形)</label>
          <label><input type="radio" name="select-shape-type" value="triangle"> triangle(三角形)</label>
        </li>
        <li class="menu-item">
          <select name="select-color-type">
            <option value="stroke">边框</option>
            <option value="fill">背景</option>
          </select>
          <label><input type="checkbox" id="input-check-transparent">transparent(透明)</label>
          <div id="tui-shape-color-picker"></div>
        </li>
        <li class="menu-item"><label class="menu-item no-pointer">Stroke width(边宽)<input id="input-stroke-width-range" type="range" min="1" max="3" value="1"></label></li>
        <li class="menu-item close">关闭</li>
      </ul>
    </div>
    <div class="sub-menu-container" id="icon-sub-menu">
      <ul class="menu">
        <li class="menu-item">
          <div id="tui-icon-color-picker">Icon color(图标颜色)</div>
        </li>
        <li class="menu-item border" id="btn-register-icon">Register custom icon(注册新增图标)</li>
        <li class="menu-item icon-text" data-icon-type="arrow">➡</li>
        <li class="menu-item icon-text" data-icon-type="cancel">✖</li>
        <li class="menu-item close">Close(关闭)</li>
      </ul>
    </div>
    <div class="sub-menu-container" id="text-sub-menu">
      <ul class="menu">
        <li class="menu-item">
          <div>
            <button class="btn-text-style" data-style-type="b">Bold(粗体)</button>
            <button class="btn-text-style" data-style-type="i">Italic(斜体)</button>
            <button class="btn-text-style" data-style-type="u">Underline(下划线)</button>
          </div>
          <div>
            <button class="btn-text-style" data-style-type="l">Left(靠左)</button>
            <button class="btn-text-style" data-style-type="c">Center(居中)</button>
            <button class="btn-text-style" data-style-type="r">Right(靠右)</button>
          </div>
        </li>
        <li class="menu-item"><label class="no-pointer"><input id="input-font-size-range" type="range" min="10" max="100" value="10"></label></li>
        <li class="menu-item">
          <div id="tui-text-color-picker">Text color(文字颜色)</div>
        </li>
        <li class="menu-item close">Close(关闭)</li>
      </ul>
    </div>
    <div class="sub-menu-container" id="filter-sub-menu">
      <ul class="menu">
        <li class="menu-item border input-wrapper">
          Load Mask Image(上传模糊图片)
          <input type="file" accept="image/*" id="input-mask-image-file">
        </li>
        <li class="menu-item" id="btn-apply-mask">Apply mask filter(应用模糊过滤)</li>
        <li class="menu-item close">Close(关闭)</li>
      </ul>
    </div>
    <div class="sub-menu-container" id="image-filter-sub-menu">
      <ul class="menu">
        <li class="menu-item align-left-top">
          <table>
            <tbody>
            <tr>
              <td><label><input type="checkbox" id="input-check-grayscale">Grayscale</label></td>
              <td><label><input type="checkbox" id="input-check-invert">Invert</label></td>
              <td><label><input type="checkbox" id="input-check-sepia">Sepia</label></td>
            </tr>
            <tr>
              <td><label><input type="checkbox" id="input-check-sepia2">Sepia2</label></td>
              <td><label><input type="checkbox" id="input-check-blur">Blur</label></td>
              <td><label><input type="checkbox" id="input-check-sharpen">Sharpen</label></td>
            </tr>
            <tr>
              <td><label><input type="checkbox" id="input-check-emboss">Emboss</label></td>
            </tr>
            </tbody>
          </table>
        </li>
        <li class="menu-item align-left-top">
          <p>
            <label><input type="checkbox" id="input-check-remove-white">RemoveWhite</label><br>
            <label>Threshold<input class="range-narrow" id="input-range-remove-white-threshold" type="range" min="0" value="60" max="255"></label><br>
            <label>Distance<input class="range-narrow" id="input-range-remove-white-distance" type="range" min="0" value="10" max="255"></label>
          </p>
        </li>
        <li class="menu-item align-left-top">
          <p>
            <label><input type="checkbox" id="input-check-brightness">Brightness</label><br>
            <label>Value<input class="range-narrow" id="input-range-brightness-value" type="range" min="-255" value="100" max="255"></label>
          </p>
        </li>
        <li class="menu-item align-left-top">
          <p>
            <label><input type="checkbox" id="input-check-noise">Noise</label><br>
            <label>Value<input class="range-narrow" id="input-range-noise-value" type="range" min="0" value="100" max="1000"></label>
          </p>
        </li>
        <li class="menu-item align-left-top">
          <p>
            <label><input type="checkbox" id="input-check-gradient-transparancy">GradientTransparency</label><br>
            <label>Value<input class="range-narrow" id="input-range-gradient-transparency-value" type="range" min="0" value="100" max="255"></label>
          </p>
        </li>
        <li class="menu-item align-left-top">
          <p>
            <label><input type="checkbox" id="input-check-pixelate">Pixelate</label><br>
            <label>Value<input class="range-narrow" id="input-range-pixelate-value" type="range" min="2" value="4" max="20"></label>
          </p>
        </li>
        <li class="menu-item align-left-top">
          <p>
            <label><input type="checkbox" id="input-check-tint">Tint</label><br>
          <div id="tui-tint-color-picker"></div>
          <label>Opacity<input class="range-narrow" id="input-range-tint-opacity-value" type="range" min="0" value="1" max="1" step="0.1"></label>
          </p>
        </li>
        <li class="menu-item align-left-top">
          <p>
            <label><input type="checkbox" id="input-check-multiply">Multiply</label>
          <div id="tui-multiply-color-picker"></div>
          </p>
        </li>
        <li class="menu-item align-left-top">
          <p>
            <label><input type="checkbox" id="input-check-blend">Blend</label>
          <div id="tui-blend-color-picker"></div>
          <select name="select-blend-type">
            <option value="add" selected>Add</option>
            <option value="diff">Diff</option>
            <option value="diff">Subtract</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
            <option value="lighten">Lighten</option>
            <option value="darken">Darken</option>
          </select>
          </p>
        </li><li class="menu-item align-left-top">
        <p>
          <label><input type="checkbox" id="input-check-color-filter">ColorFilter</label><br>
          <label>Threshold<input class="range-narrow" id="input-range-color-filter-value" type="range" min="0" value="45" max="255"></label>
        </p>
      </li>
        <li class="menu-item close">Close</li>
      </ul>
    </div>

  </div>
</template>

<script>
  // import '../../../static/imageEditor/js/basic'
  import '../../../static/imageEditor/css/colorpicker.min.css';
  import '../../../static/imageEditor/css/tui-image-editor.css';
    export default{
        name: 'Fabric',
        data: function () {
            return {}
        },
        mounted: function () {
          /**
           * basic.js
           * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
           * @fileoverview
           */
          'use strict';

          var supportingFileAPI = !!(window.File && window.FileList && window.FileReader);
          var rImageType = /data:(image\/.+);base64,/;
          var shapeOptions = {};
          var shapeType;
          var activeObjectId;

// Buttons
          var $btns = $('.menu-item');
          var $btnsActivatable = $btns.filter('.activatable');
          var $inputImage = $('#input-image-file');
          var $btnDownload = $('#btn-download');

          var $btnUndo = $('#btn-undo');
          var $btnRedo = $('#btn-redo');
          var $btnClearObjects = $('#btn-clear-objects');
          var $btnRemoveActiveObject = $('#btn-remove-active-object');
          var $btnCrop = $('#btn-crop');
          var $btnFlip = $('#btn-flip');
          var $btnRotation = $('#btn-rotation');
          var $btnDrawLine = $('#btn-draw-line');
          var $btnDrawShape = $('#btn-draw-shape');
          var $btnApplyCrop = $('#btn-apply-crop');
          var $btnCancelCrop = $('#btn-cancel-crop');
          var $btnFlipX = $('#btn-flip-x');
          var $btnFlipY = $('#btn-flip-y');
          var $btnResetFlip = $('#btn-reset-flip');
          var $btnRotateClockwise = $('#btn-rotate-clockwise');
          var $btnRotateCounterClockWise = $('#btn-rotate-counter-clockwise');
          var $btnText = $('#btn-text');
          var $btnTextStyle = $('.btn-text-style');
          var $btnAddIcon = $('#btn-add-icon');
          var $btnRegisterIcon = $('#btn-register-icon');
          var $btnMaskFilter = $('#btn-mask-filter');
          var $btnImageFilter = $('#btn-image-filter');
          var $btnLoadMaskImage = $('#input-mask-image-file');
          var $btnApplyMask = $('#btn-apply-mask');
          var $btnClose = $('.close');

// Input etc.
          var $inputRotationRange = $('#input-rotation-range');
          var $inputBrushWidthRange = $('#input-brush-width-range');
          var $inputFontSizeRange = $('#input-font-size-range');
          var $inputStrokeWidthRange = $('#input-stroke-width-range');
          var $inputCheckTransparent = $('#input-check-transparent');
          var $inputCheckGrayscale = $('#input-check-grayscale');
          var $inputCheckInvert = $('#input-check-invert');
          var $inputCheckSepia = $('#input-check-sepia');
          var $inputCheckSepia2 = $('#input-check-sepia2');
          var $inputCheckBlur = $('#input-check-blur');
          var $inputCheckSharpen = $('#input-check-sharpen');
          var $inputCheckEmboss = $('#input-check-emboss');
          var $inputCheckRemoveWhite = $('#input-check-remove-white');
          var $inputRangeRemoveWhiteThreshold = $('#input-range-remove-white-threshold');
          var $inputRangeRemoveWhiteDistance = $('#input-range-remove-white-distance');
          var $inputCheckBrightness = $('#input-check-brightness');
          var $inputRangeBrightnessValue = $('#input-range-brightness-value');
          var $inputCheckNoise = $('#input-check-noise');
          var $inputRangeNoiseValue = $('#input-range-noise-value');
          var $inputCheckGradientTransparency = $('#input-check-gradient-transparancy');
          var $inputRangeGradientTransparencyValue = $('#input-range-gradient-transparency-value');
          var $inputCheckPixelate = $('#input-check-pixelate');
          var $inputRangePixelateValue = $('#input-range-pixelate-value');
          var $inputCheckTint = $('#input-check-tint');
          var $inputRangeTintOpacityValue = $('#input-range-tint-opacity-value');
          var $inputCheckMultiply = $('#input-check-multiply');
          var $inputCheckBlend = $('#input-check-blend');
          var $inputCheckColorFilter = $('#input-check-color-filter');
          var $inputRangeColorFilterValue = $('#input-range-color-filter-value');

// Sub menus
          var $displayingSubMenu = $();
          var $cropSubMenu = $('#crop-sub-menu');
          var $flipSubMenu = $('#flip-sub-menu');
          var $rotationSubMenu = $('#rotation-sub-menu');
          var $freeDrawingSubMenu = $('#free-drawing-sub-menu');
          var $drawLineSubMenu = $('#draw-line-sub-menu');
          var $drawShapeSubMenu = $('#draw-shape-sub-menu');
          var $textSubMenu = $('#text-sub-menu');
          var $iconSubMenu = $('#icon-sub-menu');
          var $filterSubMenu = $('#filter-sub-menu');
          var $imageFilterSubMenu = $('#image-filter-sub-menu');

// Select line type
          var $selectLine = $('[name="select-line-type"]');

// Select shape type
          var $selectShapeType = $('[name="select-shape-type"]');

// Select color of shape type
          var $selectColorType = $('[name="select-color-type"]');

//Select blend type
          var $selectBlendType = $('[name="select-blend-type"]');

// Image editor
          var imageEditor = new tui.ImageEditor('.tui-image-editor', {
            cssMaxWidth: 1700,
            cssMaxHeight: 900,
            selectionStyle: {
              cornerSize: 20,
              rotatingPointOffset: 70
            }
          });

// Color picker for free drawing
          var brushColorpicker = tui.component.colorpicker.create({
            container: $('#tui-brush-color-picker')[0],
            color: '#000000'
          });

// Color picker for text palette
          var textColorpicker = tui.component.colorpicker.create({
            container: $('#tui-text-color-picker')[0],
            color: '#000000'
          });

// Color picker for shape
          var shapeColorpicker = tui.component.colorpicker.create({
            container: $('#tui-shape-color-picker')[0],
            color: '#000000'
          });

// Color picker for icon
          var iconColorpicker = tui.component.colorpicker.create({
            container: $('#tui-icon-color-picker')[0],
            color: '#000000'
          });

          var tintColorpicker = tui.component.colorpicker.create({
            container: $('#tui-tint-color-picker')[0],
            color: '#000000'
          });

          var multiplyColorpicker = tui.component.colorpicker.create({
            container: $('#tui-multiply-color-picker')[0],
            color: '#000000'
          });

          var blendColorpicker = tui.component.colorpicker.create({
            container: $('#tui-blend-color-picker')[0],
            color: '#00FF00'
          });

// Common global functions
// HEX to RGBA
          function hexToRGBa(hex, alpha) {
            var r = parseInt(hex.slice(1, 3), 16);
            var g = parseInt(hex.slice(3, 5), 16);
            var b = parseInt(hex.slice(5, 7), 16);
            var a = alpha || 1;

            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
          }

          function base64ToBlob(data) {
            var mimeString = '';
            var raw, uInt8Array, i, rawLength;

            raw = data.replace(rImageType, function(header, imageType) {
              mimeString = imageType;

              return '';
            });

            raw = atob(raw);
            rawLength = raw.length;
            uInt8Array = new Uint8Array(rawLength); // eslint-disable-line

            for (i = 0; i < rawLength; i += 1) {
              uInt8Array[i] = raw.charCodeAt(i);
            }

            return new Blob([uInt8Array], {type: mimeString});
          }

          function resizeEditor() {
            var $editor = $('.tui-image-editor');
            var $container = $('.tui-image-editor-canvas-container');
            var height = parseFloat($container.css('max-height'));

            $editor.height(height);
          }

          function getBrushSettings() {
            var brushWidth = $inputBrushWidthRange.val();
            var brushColor = brushColorpicker.getColor();

            return {
              width: brushWidth,
              color: hexToRGBa(brushColor, 0.5)
            };
          }

          function activateShapeMode() {
            if (imageEditor.getDrawingMode() !== 'SHAPE') {
              imageEditor.stopDrawingMode();
              imageEditor.startDrawingMode('SHAPE');
            }
          }

          function activateIconMode() {
            imageEditor.stopDrawingMode();
          }

          function activateTextMode() {
            if (imageEditor.getDrawingMode() !== 'TEXT') {
              imageEditor.stopDrawingMode();
              imageEditor.startDrawingMode('TEXT');
            }
          }

          function setTextToolbar(obj) {
            var fontSize = obj.fontSize;
            var fontColor = obj.fill;

            $inputFontSizeRange.val(fontSize);
            textColorpicker.setColor(fontColor);
          }

          function setIconToolbar(obj) {
            var iconColor = obj.fill;

            iconColorpicker.setColor(iconColor);
          }

          function setShapeToolbar(obj) {
            var strokeColor, fillColor, isTransparent;
            var colorType = $selectColorType.val();

            if (colorType === 'stroke') {
              strokeColor = obj.stroke;
              isTransparent = (strokeColor === 'transparent');

              if (!isTransparent) {
                shapeColorpicker.setColor(strokeColor);
              }
            } else if (colorType === 'fill') {
              fillColor = obj.fill;
              isTransparent = (fillColor === 'transparent');

              if (!isTransparent) {
                shapeColorpicker.setColor(fillColor);
              }
            }

            $inputCheckTransparent.prop('checked', isTransparent);
            $inputStrokeWidthRange.val(obj.strokeWidth);
          }

          function showSubMenu(type) {
            var $submenu;

            switch (type) {
              case 'shape':
                $submenu = $drawShapeSubMenu;
                break;
              case 'icon':
                $submenu = $iconSubMenu;
                break;
              case 'text':
                $submenu = $textSubMenu;
                break;
              default:
                $submenu = 0;
            }

            $displayingSubMenu.hide();
            $displayingSubMenu = $submenu.show();
          }

          function applyOrRemoveFilter(applying, type, options) {
            if (applying) {
              imageEditor.applyFilter(type, options).then(result => {
                console.log(result);
            });
            } else {
              imageEditor.removeFilter(type);
            }
          }

// Attach image editor custom events
          imageEditor.on({
            objectAdded: function(objectProps) {
              console.info(objectProps);
            },
            undoStackChanged: function(length) {
              if (length) {
                $btnUndo.removeClass('disabled');
              } else {
                $btnUndo.addClass('disabled');
              }
              resizeEditor();
            },
            redoStackChanged: function(length) {
              if (length) {
                $btnRedo.removeClass('disabled');
              } else {
                $btnRedo.addClass('disabled');
              }
              resizeEditor();
            },
            objectScaled: function(obj) {
              if (obj.type === 'text') {
                $inputFontSizeRange.val(obj.fontSize);
              }
            },
            addText: function(pos) {
              imageEditor.addText('Double Click', {
                position: pos.originPosition
              }).then(objectProps => {
                console.log(objectProps);
            });
            },
            objectActivated: function(obj) {
              activeObjectId = obj.id;
              if (obj.type === 'rect' || obj.type === 'circle' || obj.type === 'triangle') {
                showSubMenu('shape');
                setShapeToolbar(obj);
                activateShapeMode();
              } else if (obj.type === 'icon') {
                showSubMenu('icon');
                setIconToolbar(obj);
                activateIconMode();
              } else if (obj.type === 'text') {
                showSubMenu('text');
                setTextToolbar(obj);
                activateTextMode();
              }
              var colorType = $selectColorType.val();
              if (colorType === 'stroke') {
                imageEditor.changeShape(activeObjectId, {
                  fill: "transparent"
                });
              } else if (colorType === 'fill') {
                imageEditor.changeShape(activeObjectId, {
                  fill: "transparent"
                });
              }
            },
            mousedown: function(event, originPointer) {
              if ($imageFilterSubMenu.is(':visible') && imageEditor.hasFilter('colorFilter')) {
                imageEditor.applyFilter('colorFilter', {
                  x: parseInt(originPointer.x, 10),
                  y: parseInt(originPointer.y, 10)
                });
              }
            }
          });

// Attach button click event listeners
          $btns.on('click', function() {
            $btnsActivatable.removeClass('active');
          });

          $btnsActivatable.on('click', function() {
            $(this).addClass('active');
          });

          $btnUndo.on('click', function() {
            $displayingSubMenu.hide();

            if (!$(this).hasClass('disabled')) {
              imageEditor.undo();
            }
          });

          $btnRedo.on('click', function() {
            $displayingSubMenu.hide();

            if (!$(this).hasClass('disabled')) {
              imageEditor.redo();
            }
          });

          $btnClearObjects.on('click', function() {
            $displayingSubMenu.hide();
            imageEditor.clearObjects();
          });
          Bus.$off('clearFabric');
          Bus.$on('clearFabric',function(){
            imageEditor.clearObjects();
          })
          $btnRemoveActiveObject.on('click', function() {
            $displayingSubMenu.hide();
            imageEditor.removeObject(activeObjectId);
          });

          $btnCrop.on('click', function() {
            imageEditor.startDrawingMode('CROPPER');
            $displayingSubMenu.hide();
            $displayingSubMenu = $cropSubMenu.show();
          });

          $btnFlip.on('click', function() {
            imageEditor.stopDrawingMode();
            $displayingSubMenu.hide();
            $displayingSubMenu = $flipSubMenu.show();
          });

          $btnRotation.on('click', function() {
            imageEditor.stopDrawingMode();
            $displayingSubMenu.hide();
            $displayingSubMenu = $rotationSubMenu.show();
          });

          $btnClose.on('click', function() {
            imageEditor.stopDrawingMode();
            $displayingSubMenu.hide();
          });

          $btnApplyCrop.on('click', function() {
            imageEditor.crop(imageEditor.getCropzoneRect()).then(() => {
              imageEditor.stopDrawingMode();
            resizeEditor();
          });
          });

          $btnCancelCrop.on('click', function() {
            imageEditor.stopDrawingMode();
          });

          $btnFlipX.on('click', function() {
            imageEditor.flipX().then(status => {
              console.log('flipX: ', status.flipX);
            console.log('flipY: ', status.flipY);
            console.log('angle: ', status.angle);
          });
          });

          $btnFlipY.on('click', function() {
            imageEditor.flipY().then(status => {
              console.log('flipX: ', status.flipX);
            console.log('flipY: ', status.flipY);
            console.log('angle: ', status.angle);
          });
          });

          $btnResetFlip.on('click', function() {
            imageEditor.resetFlip().then(status => {
              console.log('flipX: ', status.flipX);
            console.log('flipY: ', status.flipY);
            console.log('angle: ', status.angle);
          });
          });

          $btnRotateClockwise.on('click', function() {
            imageEditor.rotate(30);
          });

          $btnRotateCounterClockWise.on('click', function() {
            imageEditor.rotate(-30);
          });

          $inputRotationRange.on('mousedown', function() {
            var changeAngle = function() {
              imageEditor.setAngle(parseInt($inputRotationRange.val(), 10)).catch(() => {});
            };
            $(document).on('mousemove', changeAngle);
            $(document).on('mouseup', function stopChangingAngle() {
              $(document).off('mousemove', changeAngle);
              $(document).off('mouseup', stopChangingAngle);
            });
          });

          $inputRotationRange.on('change', function() {
            imageEditor.setAngle(parseInt($inputRotationRange.val(), 10)).catch(() => {});
          });

          $inputBrushWidthRange.on('change', function() {
            imageEditor.setBrush({width: parseInt(this.value, 10)});
          });

          $inputImage.on('change', function(event) {
            var file;

            if (!supportingFileAPI) {
              alert('This browser does not support file-api');
            }

            file = event.target.files[0];
            imageEditor.loadImageFromFile(file).then(result => {
              console.log(result);
            imageEditor.clearUndoStack();
          });
          });

          $btnDownload.on('click', function() {
            var imageName = imageEditor.getImageName();
            var dataURL = imageEditor.toDataURL();
            var blob, type, w;

            if (supportingFileAPI) {
              blob = base64ToBlob(dataURL);
              type = blob.type.split('/')[1];
              if (imageName.split('.').pop() !== type) {
                imageName += '.' + type;
              }

              // Library: FileSaver - saveAs
              saveAs(blob, imageName); // eslint-disable-line
            } else {
              alert('This browser needs a file-server');
              w = window.open();
              w.document.body.innerHTML = '<img src=' + dataURL + '>';
            }
          });

// control draw line mode
          $btnDrawLine.on('click', function() {
            imageEditor.stopDrawingMode();
            $displayingSubMenu.hide();
            $displayingSubMenu = $drawLineSubMenu.show();
            $selectLine.eq(0).change();
          });

          $selectLine.on('change', function() {
            var mode = $(this).val();
            var settings = getBrushSettings();

            imageEditor.stopDrawingMode();
            if (mode === 'freeDrawing') {
              imageEditor.startDrawingMode('FREE_DRAWING', settings);
            } else {
              imageEditor.startDrawingMode('LINE_DRAWING', settings);
            }
          });

          brushColorpicker.on('selectColor', function(event) {
            imageEditor.setBrush({
              color: hexToRGBa(event.color, 0.5)
            });
          });

// control draw shape mode
          $btnDrawShape.on('click', function() {
            showSubMenu('shape');

            // step 1. get options to draw shape from toolbar
            shapeType = $('[name="select-shape-type"]:checked').val();

            shapeOptions.stroke = '#000000';
            shapeOptions.fill = '#ffffff';

            shapeOptions.strokeWidth = Number($inputStrokeWidthRange.val());

            // step 2. set options to draw shape
            imageEditor.setDrawingShape(shapeType, shapeOptions);

            // step 3. start drawing shape mode
            activateShapeMode();
          });

          $selectShapeType.on('change', function() {
            shapeType = $(this).val();

            imageEditor.setDrawingShape(shapeType);
          });

          $inputCheckTransparent.on('change', function() {
            var colorType = $selectColorType.val();
            var isTransparent = $(this).prop('checked');
            var color;

            if (!isTransparent) {
              color = shapeColorpicker.getColor();
            } else {
              color = 'transparent';
            }

            if (colorType === 'stroke') {
              imageEditor.changeShape(activeObjectId, {
                stroke: color
              });
            } else if (colorType === 'fill') {
              imageEditor.changeShape(activeObjectId, {
                fill: color
              });
            }

            imageEditor.setDrawingShape(shapeType, shapeOptions);
          });

          shapeColorpicker.on('selectColor', function(event) {
            var colorType = $selectColorType.val();
            var isTransparent = $inputCheckTransparent.prop('checked');
            var color = event.color;

            if (isTransparent) {
              return;
            }

            if (colorType === 'stroke') {
              imageEditor.changeShape(activeObjectId, {
                stroke: color
              });
            } else if (colorType === 'fill') {
              imageEditor.changeShape(activeObjectId, {
                fill: color
              });
            }

            imageEditor.setDrawingShape(shapeType, shapeOptions);
          });

          $inputStrokeWidthRange.on('change', function() {
            var strokeWidth = Number($(this).val());

            imageEditor.changeShape(activeObjectId, {
              strokeWidth: strokeWidth
            });

            imageEditor.setDrawingShape(shapeType, shapeOptions);
          });

// control text mode
          $btnText.on('click', function() {
            showSubMenu('text');
            activateTextMode();
          });

          $inputFontSizeRange.on('change', function() {
            imageEditor.changeTextStyle(activeObjectId, {
              fontSize: parseInt(this.value, 10)
            });
          });

          $btnTextStyle.on('click', function(e) { // eslint-disable-line
            var styleType = $(this).attr('data-style-type');
            var styleObj;

            e.stopPropagation();

            switch (styleType) {
              case 'b':
                styleObj = {fontWeight: 'bold'};
                break;
              case 'i':
                styleObj = {fontStyle: 'italic'};
                break;
              case 'u':
                styleObj = {textDecoration: 'underline'};
                break;
              case 'l':
                styleObj = {textAlign: 'left'};
                break;
              case 'c':
                styleObj = {textAlign: 'center'};
                break;
              case 'r':
                styleObj = {textAlign: 'right'};
                break;
              default:
                styleObj = {};
            }

            imageEditor.changeTextStyle(activeObjectId, styleObj);
          });

          textColorpicker.on('selectColor', function(event) {
            imageEditor.changeTextStyle(activeObjectId, {
              'fill': event.color
            });
          });

// control icon
          $btnAddIcon.on('click', function() {
            showSubMenu('icon');
            activateIconMode();
          });

          function onClickIconSubMenu(event) {
            var element = event.target || event.srcElement;
            var iconType = $(element).attr('data-icon-type');

            imageEditor.once('mousedown', function(e, originPointer) {
              imageEditor.addIcon(iconType, {
                left: originPointer.x,
                top: originPointer.y
              }).then(objectProps => {
                console.log(objectProps);
            });
            });
          }

          $btnRegisterIcon.on('click', function() {
            $iconSubMenu.find('.menu-item').eq(3).after(
              '<li id="customArrow" class="menu-item icon-text" data-icon-type="customArrow">↑</li>'
            );

            imageEditor.registerIcons({
              customArrow: 'M 60 0 L 120 60 H 90 L 75 45 V 180 H 45 V 45 L 30 60 H 0 Z'
            });

            $btnRegisterIcon.off('click');

            $iconSubMenu.on('click', '#customArrow', onClickIconSubMenu);
          });

          $iconSubMenu.on('click', '.icon-text', onClickIconSubMenu);

          iconColorpicker.on('selectColor', function(event) {
            imageEditor.changeIconColor(activeObjectId, event.color);
          });

// control mask filter
          $btnMaskFilter.on('click', function() {
            imageEditor.stopDrawingMode();
            $displayingSubMenu.hide();

            $displayingSubMenu = $filterSubMenu.show();
          });

          $btnImageFilter.on('click', function() {
            var filters = {
              'grayscale': $inputCheckGrayscale,
              'invert': $inputCheckInvert,
              'sepia': $inputCheckSepia,
              'sepia2': $inputCheckSepia2,
              'blur': $inputCheckBlur,
              'shapren': $inputCheckSharpen,
              'emboss': $inputCheckEmboss,
              'removeWhite': $inputCheckRemoveWhite,
              'brightness': $inputCheckBrightness,
              'noise': $inputCheckNoise,
              'gradientTransparency': $inputCheckGradientTransparency,
              'pixelate': $inputCheckPixelate,
              'tint': $inputCheckTint,
              'multiply': $inputCheckMultiply,
              'blend': $inputCheckBlend,
              'colorFilter': $inputCheckColorFilter
            };

            tui.util.forEach(filters, function($value, key) {
              $value.prop('checked', imageEditor.hasFilter(key));
            });
            $displayingSubMenu.hide();

            $displayingSubMenu = $imageFilterSubMenu.show();
          });

          $btnLoadMaskImage.on('change', function() {
            var file;
            var imgUrl;

            if (!supportingFileAPI) {
              alert('This browser does not support file-api');
            }

            file = event.target.files[0];

            if (file) {
              imgUrl = URL.createObjectURL(file);

              imageEditor.loadImageFromURL(imageEditor.toDataURL(), 'FilterImage').then(() => {
                imageEditor.addImageObject(imgUrl).then(objectProps => {
                URL.revokeObjectURL(file);
              console.log(objectProps);
            });
            });
            }
          });

          $btnApplyMask.on('click', function() {
            imageEditor.applyFilter('mask', {
              maskObjId: activeObjectId
            }).then(result => {
              console.log(result);
          });
          });

          $inputCheckGrayscale.on('change', function() {
            applyOrRemoveFilter(this.checked, 'Grayscale', null);
          });

          $inputCheckInvert.on('change', function() {
            applyOrRemoveFilter(this.checked, 'Invert', null);
          });

          $inputCheckSepia.on('change', function() {
            applyOrRemoveFilter(this.checked, 'Sepia', null);
          });

          $inputCheckSepia2.on('change', function() {
            applyOrRemoveFilter(this.checked, 'Sepia2', null);
          });

          $inputCheckBlur.on('change', function() {
            applyOrRemoveFilter(this.checked, 'Blur', null);
          });

          $inputCheckSharpen.on('change', function() {
            applyOrRemoveFilter(this.checked, 'Sharpen', null);
          });

          $inputCheckEmboss.on('change', function() {
            applyOrRemoveFilter(this.checked, 'Emboss', null);
          });

          $inputCheckRemoveWhite.on('change', function() {
            applyOrRemoveFilter(this.checked, 'removeWhite', {
              threshold: parseInt($inputRangeRemoveWhiteThreshold.val(), 10),
              distance: parseInt($inputRangeRemoveWhiteDistance.val(), 10)
            });
          });

          $inputRangeRemoveWhiteThreshold.on('change', function() {
            applyOrRemoveFilter($inputCheckRemoveWhite.is(':checked'), 'removeWhite', {
              threshold: parseInt(this.value, 10)
            });
          });

          $inputRangeRemoveWhiteDistance.on('change', function() {
            applyOrRemoveFilter($inputCheckRemoveWhite.is(':checked'), 'removeWhite', {
              distance: parseInt(this.value, 10)
            });
          });

          $inputCheckBrightness.on('change', function() {
            applyOrRemoveFilter(this.checked, 'brightness', {
              brightness: parseInt($inputRangeBrightnessValue.val(), 10)
            });
          });

          $inputRangeBrightnessValue.on('change', function() {
            applyOrRemoveFilter($inputCheckBrightness.is(':checked'), 'brightness', {
              brightness: parseInt(this.value, 10)
            });
          });

          $inputCheckNoise.on('change', function() {
            applyOrRemoveFilter(this.checked, 'noise', {
              noise: parseInt($inputRangeNoiseValue.val(), 10)
            });
          });

          $inputRangeNoiseValue.on('change', function() {
            applyOrRemoveFilter($inputCheckNoise.is(':checked'), 'noise', {
              noise: parseInt(this.value, 10)
            });
          });

          $inputCheckGradientTransparency.on('change', function() {
            applyOrRemoveFilter(this.checked, 'gradientTransparency', {
              threshold: parseInt($inputRangeGradientTransparencyValue.val(), 10)
            });
          });

          $inputRangeGradientTransparencyValue.on('change', function() {
            applyOrRemoveFilter($inputCheckGradientTransparency.is(':checked'), 'gradientTransparency', {
              threshold: parseInt(this.value, 10)
            });
          });

          $inputCheckPixelate.on('change', function() {
            applyOrRemoveFilter(this.checked, 'pixelate', {
              blocksize: parseInt($inputRangePixelateValue.val(), 10)
            });
          });

          $inputRangePixelateValue.on('change', function() {
            applyOrRemoveFilter($inputCheckPixelate.is(':checked'), 'pixelate', {
              blocksize: parseInt(this.value, 10)
            });
          });

          $inputCheckTint.on('change', function() {
            applyOrRemoveFilter(this.checked, 'tint', {
              color: tintColorpicker.getColor(),
              opacity: parseFloat($inputRangeTintOpacityValue.val())
            });
          });

          tintColorpicker.on('selectColor', function(e) {
            applyOrRemoveFilter($inputCheckTint.is(':checked'), 'tint', {
              color: e.color
            });
          });

          $inputRangeTintOpacityValue.on('change', function() {
            applyOrRemoveFilter($inputCheckTint.is(':checked'), 'tint', {
              opacity: parseFloat($inputRangeTintOpacityValue.val())
            });
          });

          $inputCheckMultiply.on('change', function() {
            applyOrRemoveFilter(this.checked, 'multiply', {
              color: multiplyColorpicker.getColor()
            });
          });

          multiplyColorpicker.on('selectColor', function(e) {
            applyOrRemoveFilter($inputCheckMultiply.is(':checked'), 'multiply', {
              color: e.color
            });
          });

          $inputCheckBlend.on('change', function() {
            applyOrRemoveFilter(this.checked, 'blend', {
              color: blendColorpicker.getColor(),
              mode: $selectBlendType.val()
            });
          });

          blendColorpicker.on('selectColor', function(e) {
            applyOrRemoveFilter($inputCheckBlend.is(':checked'), 'blend', {
              color: e.color
            });
          });

          $selectBlendType.on('change', function() {
            applyOrRemoveFilter($inputCheckBlend.is(':checked'), 'blend', {
              mode: this.value
            });
          });

          $inputCheckColorFilter.on('change', function() {
            applyOrRemoveFilter(this.checked, 'colorFilter', {
              color: '#FFFFFF',
              threshold: $inputRangeColorFilterValue.val()
            });
          });

          $inputRangeColorFilterValue.on('change', function() {
            applyOrRemoveFilter($inputCheckColorFilter.is(':checked'), 'colorFilter', {
              threshold: this.value
            });
          });

// Etc..

// Load sample image
          imageEditor.loadImageFromURL('../../static/imageEditor/img/new.png', 'SampleImage').then(sizeValue => {
            console.log(sizeValue);
          imageEditor.clearUndoStack();
        });

// IE9 Unselectable
          $('.menu').on('selectstart', function() {
            return false;
          });
          $displayingSubMenu = $drawLineSubMenu.show();
        },
        methods: {}
    }
</script>

<style></style>
