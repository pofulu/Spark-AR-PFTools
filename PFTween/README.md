# PFTween
PFTween is a wrapped Spark AR animation function. You can handle animation in Spark AR just like [DOTween](http://dotween.demigiant.com) in Unity.

## How to use

0. [Download PFTween](https://github.com/pofulu/Spark-AR-PFTools/raw/master/PFTween/PFTween.js) (Right click and Save as)
1. Drap/Import to Assets caetgory in Spark AR. (Spark AR support multiple script files after [v75](https://sparkar.facebook.com/ar-studio/learn/documentation/changelog#75))
2. Import `Ease` and `PFTween` module at the top of your main script.
```javascript
import { Ease, PFTween } from './PFTween';

// Your script...
```

3. You can also [Click Here to Download a Sample Project](https://github.com/pofulu/Spark-AR-PFTools/raw/master/PFTween/PFTween%20Sample.zip).

   

## Getting Start

Let's say you want to scale a plane:
```javascript
const Scene = require('Scene'); 

const plane0 = Scene.root.find('plane0');

plane0.transform.scale = new PFTween(0, 1, 1000).scale;
```

You can also change ease type:
```javascript
plane0.transform.scale = new PFTween(0, 1, 1000)
    .setEase(Ease.easeOutBack)
    .scale;
```

or make it loop:
```javascript
plane0.transform.scale = new PFTween(0, 1, 1000)
    .setEase(Ease.easeOutBack)
    .setLoop()
    .setMirror()
    .scale;
```


You can even `SetDelay`, `SetCallback`, and apply animation to position or anything you want.
```javascript
const Scene = require('Scene'); 
const Diagnostics = require('Diagnostics'); 

const plane0 = Scene.root.find('plane0');

plane0.transform.x = new PFTween(plane0.tranform.x, 0.1, 1000)
    .setLoop(2)
    .setMirror()
    .setEase(Ease.easeInOutExpo)
    .setDelay(1500)
    .onLooped(index => Diagnostics.log(`loop: ${index}`))
    .onStartVisible(plane0)    // this plane will be visible when animation start
    .onCompleteHidden(plane0)  // and will be hidden on completed
    .onComplete(() => Diagnostics.log('completed!'))
    .scalar;                   // the value type 'poisition.x' is 'scalar'
```

You can add your ease type in the script. For example, there is a `punch` ease mode:
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

and some useful callbacks: 

`onStartVisible()`

`onStartHidden()`

`onCompleteVisible()`

`onCompleteHidden()`

`onCompleteResetScale()`

`onCompleteResetPosition()`

`onCompleteResetRotation()`

`onCompleteResetOpacity()`



## Reuse the Animation

If you want to reuse the animation. For this purpose, you need use `bind` to set the value and call `apply` in the end of PFTween chain.

```javascript
const Scene = require('Scene'); 
const TouchGestures = require('TouchGestures');

const plane0 = Scene.root.find('plane0');

const ani = new PFTween(-0.1, 0.1, 1000)
    .setEase(Ease.easeOutQuard)
    .bind(value => Scene.root.find('plane0').transform.x = value) // Bind the tween value
    .onStartVisible(plane0)
    .onCompleteHidden(plane0)
    .apply(false); 	// Don't auto start animation when we call the apply()
    
TouchGestures.onTap().subscribe(() => ani.replay());   
```



## Async and Promise

You can use Promise to make the animation sequence. You need to use `bind` to set value as well. At the end of PFTween chian, you need to get the `promise` instead of call `apply`. 

When you get the `promise`, it returns a Promise, and the animation will start play immediately. 

```js
const Scene = require('Scene'); 
const Diagnostics = require('Diagnostics');

const plane = Scene.root.find('plane0');

new PFTween(0, 0.1, 1000).setEase(Ease.easeInOutCirc)
	.setMirror()
  	.setLoop(2)
  	.bind(tweener => plane.transform.x = tweener.scalar)
  	.promise
  	.then(() => Promise.all([
  		new PFTween(plane.transform.rotationZ, 270, 1000)
			.setEase(Ease.easeOutQuart)
			.bind(tweener => plane.transform.rotationZ = tweener.rotation)
			.promise,

    	new PFTween(plane.transform.scaleX, 2.5, 1000)
			.setEase(Ease.easeOutBack)
			.bind(tweener => plane.transform.scale = tweener.scale)
			.promise]))
	.then(() => Diagnostics.log('Finished'));
```

