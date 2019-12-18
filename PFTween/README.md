# PFTween
PFTween is a wrapped Spark AR animation function. You can handle animation in Spark AR just like [DOTween](http://dotween.demigiant.com) in Unity.

## How to use
1. Drap/Import to Assets caetgory in Spark AR. (Spark AR support multi scipt file after [v75](https://sparkar.facebook.com/ar-studio/learn/documentation/changelog#75))

2. import `ease` and `PFTween` module at the top of your main script.
```javascript
import { ease, PFTween } from './PFTween';

// Your script...
```

## Example
Let's say you want to scale a plane:
```javascript
const Scene = require('Scene'); 

const plane0 = Scene.root.find('plane0');

plane0.transform.scale = new PFTween(0, 1, 1000).scale;
```

You can also change ease type:
```javascript
plane0.transform.scale = new PFTween(0, 1, 1000)
    .setEase(ease.easeOutBack)
    .scale;
```

or make it loop:
```javascript
plane0.transform.scale = new PFTween(0, 1, 1000)
    .setEase(ease.easeOutBack)
    .setLoop()
    .setMirror()
    .scale;
```


You can even `SetDelay`, `SetCallback`, and apply animation to position or anything you want.
```javascript
const Scene = require('Scene'); 
const Diagnostics = require('Diagnostics'); 

const plane0 = Scene.root.find('plane0');

plane0.transform.x = new PFTween(plane0.tranform.x, 10, 1000)
    .setLoop(2)
    .setMirror()
    .setEase(ease.easeInOutExpo)
    .setDelay(1500)
    .onStartVisible(plane0)    // this plane will be visible when animation start
    .onCompleteHidden(plane0)  // and will be hidden on completed
    .onComplete(() => Diagnostics.log('completed!'))
    .scalar;                   // the value type 'poisition.x' is 'scalar'
```

Reuse the animation:
```javascript
const Scene = require('Scene'); 
const TouchGestures = require('TouchGestures');

const plane0 = Scene.root.find('plane0');
plane0.hidden = true;

const ani = new PFTween(plane0.tranform.x, 10, 1000)
    .onUpdate(value => Scene.root.find('plane0').transform.x = value)
    .onStartVisible(plane0)
    .onCompleteHidden(plane0)
    .apply(false); 
    
TouchGestures.onTap().subscribe(() => ani.replay());   
```

You can add your ease type in the script. For example, there is a 'punch' ease mode:
```javascript
const Scene = require('Scene'); 
const plane0 = Scene.root.find('plane0');

plane0.transform.scale = new PFTween(1, 0.1, 400)
    .setEase(ease.punch)
    .scale;
```

Build-in some useful data type: `rotation`, `scalar`, `scale`, `pack3`......
```javascript
const Scene = require('Scene'); 
const plane0 = Scene.root.find('plane0');

plane0.transform.rotationX = new PFTween(0, 360, 1000)
    .setMirror()
    .setEase(ease.easeOutCubic)
    .rotation;
```
