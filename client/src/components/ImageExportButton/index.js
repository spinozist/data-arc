import React from 'react';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import { Button } from 'semantic-ui-react';

const ImageExportButton = props => {

    const imageFileName = props.imageFileName;
    const imageBGColor = props.imageBGColor ? props.imageBGColor : null;;

    const exportIMG = (divID, type) => {
    var node = document.getElementById(divID);


        domtoimage.toBlob(node, {bgcolor: imageBGColor})
        .then(blob => {
            console.log(blob);
            saveAs(blob, `${imageFileName}.${type}`)
        });
    }

    return (
        <Button
        onClick={() => exportIMG(props.elementID, props.type)}
        basic
        color='teal'                    
        style={{margin: '10px', height: '40px'}}
        >
            {props.text}
        </Button>
    )
}

export default ImageExportButton;