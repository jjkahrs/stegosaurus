import {useRef, useEffect} from 'react';
import {ImageSelectorProps} from './apptypes';

const ImageSelector = ( {callback = null, onClear = null}: ImageSelectorProps) => {    
    const imgFile = useRef(null);
    const myCanvas = useRef(null);

    const updateImage = () => {
        
        if( imgFile.current.files.length == 1) {
            const file = imgFile.current.files[0];

            const context:CanvasRenderingContext2D = myCanvas.current.getContext('2d',{ willReadFrequently: true });
            const image = new Image();
            image.src = 'file://'+file.path;
            image.onload = () => {
                myCanvas.current.width = image.width;
                myCanvas.current.height = image.height;

                context.drawImage(image, 0,0, image.width, image.height, 0,0,myCanvas.current.width, myCanvas.current.height);                
                if( callback )
                    callback(file.path, context);
            }
        }
    };

    useEffect( () => {
        imgFile.current.addEventListener('change', updateImage)

    }, [imgFile.current]);

    const clear = () => {
        imgFile.current.value = ''
        onClear();
    }

    const showCanvas = (imgFile.current != null && imgFile.current.value != '');

    const fileInputStyle = showCanvas ? { display: 'none'} : { display: 'grid', gridTemplateColumns: '100%', gridTemplateRows: '90% 10%', justifyItems: 'center', marginTop: '30vh' };
    const canvasStyle = !showCanvas ? { display: 'none'} : { display:'block' };

    return (
        <div>
            <div style={fileInputStyle}>
                <input type='file' accept='image/png' ref={imgFile} tabIndex={-1}/>
                <div style={{ marginTop: '1em'}}>Select PNG image for encoding</div>
            </div>
            <div style={canvasStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: '100%', gridTemplateRows: '90% 10%', justifyItems: 'center'}}>
                    <canvas ref={myCanvas} style={{ height: '15vw'}}></canvas>
                    <div>
                        <button style={{ marginLeft: 'auto', marginRight: 'auto'}} onClick={clear}>Clear Image</button>                
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageSelector;