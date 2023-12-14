import suneditor from 'suneditor';
import plugins from 'suneditor/src/plugins';
import es from 'suneditor/src/lang/es';
import { ROUTES } from '../common';
import { join } from './utils';
import { plugin_dialog } from '../client/linkDialog';
import { onMount, onCleanup } from 'solid-js';
import './SunEditor.css';

let canvas;

export function SunEditor(props) {
  let area;
  let _editor;
  onMount(() => {
    _editor = suneditor.create(area, {
      height: '300',
      width: '100%',
      defaultTag: '',
      textTags: {
        bold: 'b',
        underline: 'u',
        italic: 'i',
        strike: 's',
      },
      mode: 'classic',
      rtl: false,
      // katex: 'window.katex',
      imageGalleryUrl: join(ROUTES.IMAGES, '/gallery'),
      videoFileInput: false,
      tabDisable: false,
      buttonList: [
        ['undo', 'redo'],
        [/*'font',*/ 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
        [
          'bold',
          'underline',
          'italic',
          'strike' /*, 'subscript', 'superscript'*/,
        ],
        ['fontColor', 'hiliteColor'],
        ['textStyle', 'removeFormat'],
        ['outdent', 'indent'],
        ['align', 'horizontalRule', 'list'],
        [
          // 'lineHeight',
          // 'table',
          //'link',
          {
            name: 'customLink',
            dataDisplay: 'dialog',
            title: 'Custom link',
            buttonClass: '',
            innerHTML:
              '<svg viewBox="0 0 24 24"><path d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z" /></svg>',
          },
          'image',
          // 'video',
          // 'audio',
          // 'math',
          // 'imageGallery',
          // 'fullScreen',
          // 'showBlocks',
          // 'codeView',
          // 'preview',
          // 'print',
          // 'save',
          // 'template',
        ],
        // [
        //   {
        //     name: 'customLink',
        //     dataDisplay: 'dialog',
        //     title: 'Custom link',
        //     buttonClass: '',
        //     innerHTML:
        //       '<svg viewBox="0 0 24 24"><path stroke="green" d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z" /></svg>',
        //   },
        // ],
      ],
      plugins: [...Object.values(plugins), plugin_dialog],
      lang: es,
    });

    _editor.onChange = (newContents) => {
      const { setValues, setErrors, setTouched } = props.form;
      setValues(props.name, newContents);
      setErrors(props.name, false);
      setTouched(props.name, true);
    };

    _editor.setContents(props.form.values[props.name]);

    const replaceImages = async () => {
      const ctx = canvas.getContext('2d');
      const images = _editor.getImagesInfo();
      let anyChanges = false;

      for (const img of images) {
        const imgEl = img.element;
        if (!img.src.startsWith('data:')) continue;
        anyChanges = true;
        const w = 800;
        const h = Math.ceil(800 * (imgEl.naturalHeight / imgEl.naturalWidth));
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(imgEl, 0, 0, w, h);
        const response = await fetch(join(ROUTES.IMAGES, img.name), {
          method: 'POST',
          body: canvas.toDataURL(),
        });
        if (response.ok) {
          imgEl.src = join(ROUTES.IMAGES, await response.text());
          imgEl.setAttribute('origin-size', `${w},${h}`);
        } else {
          console.error('response not ok');
          props.form.setErrors(
            props.name,
            `${response.statusText} on:
          ${response.url}`
          );
          throw new Error(response.statusText);
        }
      }
      if (anyChanges) props.form.setValues(props.name, _editor.getContents());
    };

    props.form.addBeforeSubmitListener(replaceImages);
  });

  onCleanup(() => {
    console.log('cleanup');
  });

  return (
    <>
      <canvas class="canvas" ref={canvas} width="800" height="600"></canvas>
      <textarea name={props.name} ref={area}></textarea>
    </>
  );
}

export default SunEditor;
