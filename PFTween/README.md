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
    .setLoops()
    .setMirror()
    .scale;
```


You can even `setDelay()`, set callback by `onLoop()`, `onComplete()`, `onStart()`, and apply tween value to position or anything you want.
```javascript
const Scene = require('Scene'); 
const Diagnostics = require('Diagnostics'); 

const plane0 = Scene.root.find('plane0');

plane0.transform.x = new PFTween(plane0.transform.x, 0.1, 1000)
    .setLoops(2)
    .setMirror()
    .setEase(Ease.easeInOutExpo)
    .setDelay(500)
    .onLoop(index => Diagnostics.log(`loop: ${index}`))
    .onStartVisible(plane0)
    .onCompleteHidden(plane0)
    .onComplete(() => Diagnostics.log('completed!'))
    .scalar;    
    // Please note that transform.x's value type is "scalar" not "scale" here
```

You can add your ease type in the script. For example, there is a `punch` ease mode:
```javascript
const Scene = require('Scene'); 
const plane0 = Scene.root.find('plane0');

plane0.transform.scale = new PFTween(1, 0.3, 400)
    .setEase(Ease.punch)
    .scale;
```

Build-in some useful data type: `rotation`, `scalar`, `scale`, `pack3`......
```javascript
const Scene = require('Scene'); 
const plane0 = Scene.root.find('plane0');

plane0.transform.rotationX = new PFTween(0, 360, 1000)
    .setMirror()
    .setEase(Ease.easeOutCubic)
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
Everytime you call `new PFTween()` will create a new animation object. In generally, it's not neccesary to create a new animation, you can reuse it for better performance. (However, in generally, user don't notice the performance impact as well)

E.g., you need to punch a image every time user open their mouth:
```javascript
FaceTracking.face(0).mouth.openness.gt(0.2).onOn().subscribe(play_punch_animation);

function play_punch_animation(){
    plane0.transform.scale = new PFTween(1, 0.3, 1000).setEase(Ease.punch).scale;
}
```
It works, but you don't need to create a new animation every time you play. So we can use `bind()` to set the value and call `apply()` at the end of PFTween chain. It will return a `PFTweener`, a controller for your `PFTween` object. You can call `replay`, `reverse`, `start`, `stop` or get `isRunning` state with `PFTweener`.

```javascript
const play_punch_animation = new PFTween(1, 0.3, 1000)
    .setEase(Ease.punch)
    .bind(tweener => plane0.transform.scale = tweener.scale)
    .apply(false);
    
FaceTracking.face(0).mouth.openness.gt(0.2).onOn().subscribe(() => play_punch_animation.replay());
```

Actually, `PFTweener` is a wrapped [`AnimationModule.TimeDriver`](https://sparkar.facebook.com/ar-studio/learn/documentation/reference/classes/animationmodule.timedriver), so you can find the similar APIs from the official document.

## Clips - Async and Promise
`clip` is an asynchronous way to reuse animation.

With `clip`, you can play tween animation in sequence.

E.g, `jump().then(scale).then(rotate).then(fadeout).then(......`

In order to use `clip`, you must set the value with `bind()`, and get `clip` instead of call `apply()` at the end of `PFTween` chain.

When you get `clip`, it returns a Promise. If you want to play the clip, just call `clip()`.

```js
const Scene = require('Scene'); 
const Diagnostics = require('Diagnostics');

const plane0 = Scene.root.find('plane0');

// Make animation and save as clip
const ani_position = new PFTween(0, 0.1, 1000)
    .setEase(Ease.easeInOutCirc)
    .setMirror()
    .setLoops(2)
    .bind(tweener => plane0.transform.x = tweener.scalar)
    .clip;

const ani_rotation = new PFTween(plane0.transform.rotationZ, 270, 1000)
    .setEase(Ease.easeOutQuart)
    .bind(tweener => plane0.transform.rotationZ = tweener.rotation)
    .clip;

const ani_scale = new PFTween(plane0.transform.scaleX, 2.5, 1000)
    .setEase(Ease.easeOutBack)
    .bind(tweener => plane0.transform.scale = tweener.scale)
    .clip;

// Play these animation in sequence
ani_position()
    .then(ani_rotation)
    .then(ani_scale)
    .then(() => Diagnostics.log('Finished'))
```



## Combine Multiple Clips

There is a static funtion for this. You can use `PFTween.combine()` to combine multiple clips in to one Promise animation.

```js
const Scene = require('Scene'); 
const Diagnostics = require('Diagnostics');

const plane0 = Scene.root.find('plane0');

// Make animation and save as clip
const ani_position = new PFTween(0, 0.1, 1000)
    .setEase(Ease.easeInOutCirc)
    .setMirror()
    .setLoops(2)
    .bind(tweener => plane0.transform.x = tweener.scalar)
    .clip;

const ani_scale = new PFTween(plane0.transform.scaleX, 2.5, 1000)
    .setMirror()
    .setLoops(2)
    .setEase(Ease.easeOutBack)
    .bind(tweener => plane0.transform.scale = tweener.scale)
    .clip;

const ani_rotation = new PFTween(plane0.transform.rotationZ, 270, 1000)
    .setEase(Ease.easeOutQuart)
    .bind(tweener => plane0.transform.rotationZ = tweener.rotation)
    .clip;

// Use PFTween.combine() to combine multiple clips
const ani_combined = PFTween.combine(ani_rotation, ani_scale);

// Play these animation in sequence
ani_position()
    .then(ani_combined)
    .then(() => Diagnostics.log('Finished'))
```



## Concatenate Multiple Clips

There is a static funtion for this. You can use `PFTween.concat()` to concatenate multiple clips in to one Promise animation. 

```js
const Scene = require('Scene'); 
const Diagnostics = require('Diagnostics');

const plane0 = Scene.root.find('plane0');

// Make animation and save as clip
const ani_position = new PFTween(0, 0.1, 1000)
    .setEase(Ease.easeInOutCirc)
    .setMirror()
    .setLoops(2)
    .bind(tweener => plane0.transform.x = tweener.scalar)
    .clip;

const ani_scale = new PFTween(plane0.transform.scaleX, 2.5, 1000)
    .setMirror()
    .setLoops(2)
    .setEase(Ease.easeOutBack)
    .bind(tweener => plane0.transform.scale = tweener.scale)
    .clip;

const ani_rotation = new PFTween(plane0.transform.rotationZ, 270, 1000)
    .setEase(Ease.easeOutQuart)
    .bind(tweener => plane0.transform.rotationZ = tweener.rotation)
    .clip;

// Use PFTween.concat() to combine multiple clips
const ani_concat = PFTween.concat(ani_position, ani_rotation, ani_scale);

// Play these animation in sequence
ani_concat()
    .then(() => Diagnostics.log('Finished'))
```

## Result of `clip()`
The default result is the end value of first `clip()` animation. Continue from previous code example: If you log the result directly, you will get `0.1`, which is the end value of `ani_position`.

```javascript
const ani_position = new PFTween(0, 0.1, ...

const ani_concat = PFTween.concat(ani_position ...

ani_concat().then(Diagnostics.log)  //0.1
```

If you want to set the result for clip chain, just add parameter when calling `clip()`.

```javascript
ani_concat('Spark AR is awesome').then(Diagnostics.log);        // Spark AR is awesome
ani_concat([1, 2, 3, 4]).then(Diagnostics.log);                 // [1, 2, 3, 4]
ani_concat({id: '3052518158091790'}).then(Diagnostics.log);     // {id: '3052518158091790'}
```
