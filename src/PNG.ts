
class PNG {
    context: CanvasRenderingContext2D;
    x: number;
    y: number;
    maxX: number;
    maxY: number;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
        this.maxX = this.context.canvas.width;
        this.maxY = this.context.canvas.height;
    }

    decode() {
        this.x = 0;
        this.y = 0;
        let output = "";
    
        let hasMore = false;

        // Check first pixel for start
        const imageData = this.context.getImageData(this.x, this.y, 1, 1);

        if (imageData.data[3] == 255 -17) {
            hasMore = true;
            this.advanceIndex();
        }

        let arr: Array<number> = [];
        
        while(hasMore) {
            const imageData = this.context.getImageData(this.x, this.y, 1, 1);

            if( imageData.data[3] == 255 - 17 ) {
                hasMore = false;
                break;
            }

            arr.push(255 - imageData.data[3])

            if(arr.length == 4) {
                const unicode = this.hexArrayToUnicode(arr);
                output = output + unicode;
                arr = [];
            }

            this.advanceIndex()
        }

        return output;
    }
    
    encode (text:string) {
        this.x = 0;
        this.y = 0;
    
        this.putTerminator()

        for( let i=0; i< text.length; i++) {
            
            const arr = this.unicodeToHexArray(text.charCodeAt(i))
            
            for(let j=0; j<arr.length; j++) {
                const imageData = this.context.getImageData(this.x, this.y, 1, 1);
                imageData.data[3] = 255 - arr[j];
                this.context.putImageData(imageData, this.x, this.y);
                this.advanceIndex()
            }
        }

        this.putTerminator()
    }

    putTerminator() {
        const imageData = this.context.getImageData(this.x, this.y, 1, 1);
        imageData.data[3] = 255 - 17;
        this.context.putImageData(imageData, this.x, this.y);
        this.advanceIndex();
    }

    advanceIndex() {
        this.x ++;
        if (this.x >= this.maxX) {
            this.x = 0;
            this.y++;
        }
    }

    hexArrayToUnicode(list: Array<number>) {
        let s = "";
        for( let i=0; i < list.length; i++ ){
            s = s + list[i].toString(16);
        }
        return String.fromCharCode(parseInt(s,16));
    }
        
    unicodeToHexArray (num: number) {
        const hexString = num.toString(16).padStart(4,'0');
        const arr:Array<number> = [];

        for( let i=0; i< hexString.length; i++) {
            const c = hexString.charAt(i);
            arr.push(parseInt(c,16));
        }
    
        return arr;
    }
    

}

export default PNG;
