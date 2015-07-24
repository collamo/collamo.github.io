"use strict";

var canvas;
var gl;

var points = [];

var numOfSubdivision = 0;
var degree = 0;
var menuSubdivision;
var menuRotation;
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    menuSubdivision = document.getElementById('menuSubdivision');
    menuSubdivision.addEventListener('input', changeSubdivision);
    menuRotation = document.getElementById('menuRotation');
    menuRotation.addEventListener('input', changeRotation);

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    draw();
};

function draw(){

  points = [];
  var vertices = [
      vec2( -0.3, -0.3 ),
      vec2(  0,  0.3 ),
      vec2(  0.3, -0.3 )
  ];

  tessellateTriangle( vertices[0], vertices[1], vertices[2],
                  numOfSubdivision);

  //
  //  Configure WebGL
  //
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

  //  Load shaders and initialize attribute buffers

  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  // Load the data into the GPU

  var bufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

  // Associate out shader variables with our data buffer

  var vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  render();

}

function triangle( a, b, c )
{
    points.push( rotatePoint(a), rotatePoint(b), rotatePoint(c) );
}

function tessellateTriangle( a, b, c, count )
{

    // check for end of recursion
    if ( count <= 0) {
        triangle( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles
        tessellateTriangle( ab, ac, bc, count );
        tessellateTriangle( a, ab, ac, count );
        tessellateTriangle( c, ac, bc, count );
        tessellateTriangle( b, bc, ab, count );
    }
}

function rotatePoint(p){

  var d = Math.sqrt( (p[0] * p[0]) + (p[1] * p[1]) );
  var theta =degree * Math.PI/180;

  var x  = p[0]*Math.cos(d*theta) - p[1]* Math.sin(d*theta);
  var y = p[0]*Math.sin(d*theta) + p[1]* Math.cos(d*theta);

  return [x, y];
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}

function changeSubdivision(e){
    numOfSubdivision = e.target.value;
    draw();
}

function changeRotation(e){
    degree = e.target.value;
    draw();
}
