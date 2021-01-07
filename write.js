const Gpio = require('pigpio').Gpio;
var	query = require('cli-interact').getYesNo;
const Drawing = require('dxf-writer');
const fs = require('fs');
let firstPos;
let secondPos;

let output;
let time = 0;
// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6/34321;

const trigger = new Gpio(23, {mode: Gpio.OUTPUT});
const echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});

trigger.digitalWrite(0); // Make sure trigger is low

const watchHCSR04 = () => {
  let startTick;

  echo.on('alert', (level, tick) => {
    if (level == 1) {
      startTick = tick;
    } else {
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      let distanceCm = Math.floor(diff / 2 / MICROSECDONDS_PER_CM);
      if (distanceCm == 0) return;
      if (time == 0) {
        firstPos = distanceCm;
        time = 1;
        console.log("First Position: " + firstPos)
      } else {
        secondPos = distanceCm;
        console.log("Second Position: " + secondPos)
        write();
      }
      ask();
    }
  });
};

watchHCSR04();
function ask() {
if (time == 0) {
  var q1 = query('Ready for first position?');
  trigger.trigger(10, 1);
        } else {
          var q2 = query('Ready for second position?');
          trigger.trigger(10, 1);
        }
      }
        function write() {
           //WRITE
      
      let d = new Drawing();
      
      d.setUnits('Centimeters');
      d.addLayer('l_green', Drawing.ACI.GREEN, 'CONTINUOUS');
      d.setActiveLayer('l_green');
      d.drawLine(0,0,firstPos,0)
      d.drawLine(0,0,0,secondPos)
      d.drawLine(firstPos,0,firstPos,secondPos)
      d.drawLine(0,secondPos,firstPos,secondPos)
      d.drawText(20, -70, 10, 0, 'Works');
      output = d.toDxfString()
      fs.writeFileSync('output.dxf',output)
      //---
      
      process.exit(1);
        }
        ask();