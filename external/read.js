
let output;
var $cadview = $('#cad-view');
var cadCanvas;

async function readFile(){
    let data = await fetch('http://192.168.0.130:9966/output.dxf')
    .then(response => response.text())
    console.log(data)
    output = data;
    var parser = new window.DxfParser();
    var dxf = parser.parseSync(data);
    var font;
    var loader = new THREE.FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( response ) {
        font = response;
        cadCanvas = new window.ThreeDxf.Viewer(dxf, document.getElementById('cad-view'),400 ,400 , font);
    });
    
}
readFile();