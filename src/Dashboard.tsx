import {useState, useRef} from 'react';
import ImageSelector from './ImageSelector';
import PNG from './PNG';

const Dashboard = () => {
    const [canvasContext, setCanvasContext] = useState(null);
    const [textContent, setTextContent] = useState("");
    const tArea = useRef();

    const styles = {
        width: '90vw',
        height: '85vh',
        margin: '2em'
    };

    const textSectionStyle = (canvasContext == null) ? { display:'none'} : { display:'block' };

    const textareaStyles = {
        width: '50vw',
        height: '40vh',
        marginTop: '3em',
        marginBottom: '1em',
        backgroundColor: '#232326',
        color: 'white',
        padding: '1em'      
    };
    
    const onFileSelect = (name:string, context:CanvasRenderingContext2D) => {
        setCanvasContext(context);

        const png = new PNG(context);
        const content = png.decode();
        setTextContent(content);
    }

    const onSave = () => {
        const image = canvasContext.canvas.toDataURL("image/png").replace("image/png","image/octet-stream");
        const element = document.createElement('a');
        element.setAttribute('href',image);
        element.setAttribute('download', "steg.png");
        element.click();
    }

    const clearImage = () => {
        canvasContext.clearRect(0,0,canvasContext.canvas.width, canvasContext.canvas.height)
        setTextContent('');
        setCanvasContext(null);
    }

    return (
    <div style={styles}>
        <section>
            <ImageSelector callback={ onFileSelect } onClear={clearImage}/>
        </section>
        <section>
            <div style={textSectionStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: '100%', gridTemplateRows: '90% 10%', justifyItems: 'center'}}>
                    <textarea ref={tArea} style={textareaStyles} tabIndex={1} value={textContent} onChange={(event => {
                            setTextContent( event.target.value );
                            const png = new PNG(canvasContext);              
                            png.encode(event.target.value)
                        })}></textarea>
                    <div>
                        <button style={{ marginTop: '1vh', marginLeft: 'auto', marginRight: 'auto', width: '6em'}} onClick={() => onSave()}>Save</button>
                    </div>
                </div>
            </div>
        </section>
    </div>
    );
}

export default Dashboard;