> This tool has been migrated [HERE](https://github.com/pofulu/sparkar-pftween) as an individual package

# PFTween
PFTween is a wrapped Spark AR animation function. You can handle animation in Spark AR just like [DOTween](http://dotween.demigiant.com) in Unity.



## Install

0. [Download PFTween](https://github.com/pofulu/Spark-AR-PFTools/raw/master/PFTween/PFTween.js) (Right click and Save as)
1. Drap/Import to Assets caetgory in Spark AR. (Spark AR support multiple script files after [v75](https://sparkar.facebook.com/ar-studio/learn/documentation/changelog#75))
2. Import `Ease` and `PFTween` module at the top of your main script.
```javascript
import { Ease, PFTween } from './PFTween';

// Your script...
```

3. You can also [Click Here to Download a Sample Project](https://github.com/pofulu/Spark-AR-PFTools/raw/master/PFTween/PFTween%20Sample.zip).

   

## Usage

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
plane0.transform.scale = new PFTween(1, 0.3, 400)
    .setEase(Ease.punch)
    .scale;		// auto pack value to Reactive.scale()
```

Build-in some useful data type: `rotation`, `scalar`, `scale`, `pack3`......
```javascript
plane0.transform.rotationZ = new PFTween(0, 360, 1000)
    .setMirror()
    .setEase(Ease.easeOutCubic)
    .rotation;	// auto convert degree to radian
```

and some useful callbacks: 

`onStartVisible()`, `onStartHidden()`, `onCompleteVisible()`, `onCompleteHidden()`, `onCompleteResetScale()`, `onCompleteResetPosition()`, `onCompleteResetRotation()`, `onCompleteResetOpacity()`



## Reuse the Animation

Everytime you call `new PFTween()` will create a new animation object. In generally, it's not neccesary to create a new animation, you can reuse it for better performance. (However, in generally, user don't notice the performance impact as well)

E.g., you need to punch a image every time user open their mouth:
```javascript
const onMouthOpen = FaceTracking.face(0).mouth.openness.gt(0.2).onOn();
mouthOpen.subscribe(play_punch_animation);

function play_punch_animation(){
    plane0.transform.scale = new PFTween(1, 0.3, 1000).setEase(Ease.punch).scale;
}
```
It works, but you don't need to create a new animation every time you play.

Use `bind()` to set the value and call `apply()` at the end of `PFTween` chain. It will return a `PFTweener`, a controller for `PFTween` object. You can call `replay`, `reverse`, `start`, `stop` or get `isRunning` state with `PFTweener`.

```javascript
const onMouthOpen = FaceTracking.face(0).mouth.openness.gt(0.2).onOn();
const play_punch_animation = new PFTween(1, 0.3, 1000)
    .setEase(Ease.punch)
    .bind(tweener => plane0.transform.scale = tweener.scale)
    .apply(false);
    
mouthOpen.subscribe(() => play_punch_animation.replay());
```

 `PFTweener` is actually a wrapped [`AnimationModule.TimeDriver`](https://sparkar.facebook.com/ar-studio/learn/documentation/reference/classes/animationmodule.timedriver), so you can find the similar APIs from the official document.



## Clip - Play Animations in Sequence

`clip` is an asynchronous way to reuse animation based on `Promise`. With `clip`, you can play tween animation in sequence.

E.g, `jump().then(scale).then(rotate).then(fadeout).then(......`

In order to use `clip`, you must set the value with `bind()`, and get `clip` instead of call `apply()` at the end of `PFTween` chain.

When you get `clip`, it returns a Promise. If you want to play the clip, just call `clip()`.

```js
const clip1 = new PFTween(0, 1, 500).clip;
const clip2 = new PFTween(1, 2, 500).clip;
const clip3 = new PFTween(2, 3, 500).clip;

clip1().then(clip2).then(clip3);
```



### Concatenate Multiple Clips

In addition to manually play multiple clips using `then()`, you can also use `PFTween.concat()` to concatenate them into one `clip`.

```js
const clip1 = new PFTween(0, 1, 500).clip;
const clip2 = new PFTween(1, 2, 500).clip;
const clip3 = new PFTween(2, 3, 500).clip;

const concat = PFTween.concat([clip1, clip2, clip3]);
// or
// const concat = PFTween.concat(clip1, clip2, clip3);

concat();
```



### Combine Multiple Clips

If you want to start multiple clips at the same time, you can use `PFTween.combine()` to combine multiple clips in to one `clip`.

```js
const clip1 = new PFTween(0, 1, 500).clip;
const clip2 = new PFTween(1, 2, 500).clip;
const clip3 = new PFTween(2, 3, 500).clip;

const combined_clip = PFTween.combine([clip1, clip2, clip3]);
// or
// const combined_clip = PFTween.concat(clip1, clip2, clip3);

combined_clip();
```

 It's the same as `Promise.all()`.



### Result of Clip

The result of clip is a object with property `value`. The default result value is the end value of first `clip()` animation.

```javascript
const clip1 = new PFTween(0, 1, 500).clip;
const clip2 = new PFTween(1, 2, 500).clip;
const clip3 = new PFTween(2, 3, 500).clip;

clip1().then(clip2).then(clip3).then(Diagnostics.log);
// {"value":1}
```

If you want to set the result for clip chain, just pass a parameter when calling `clip()`.

```javascript
concat('Spark AR is awesome').then(Diagnostics.log);
// {"value":"Spark AR is awesome"}

concat([1, 2, 3, 4]).then(Diagnostics.log);
// {"value":[1, 2, 3, 4]}

concat({ id: '3052518158091790' }).then(Diagnostics.log);
// {"value":{"id": "3052518158091790"}}
```



### Interrupt Clip

If you want to interrupt `clip()` animation, you have to use `PFTween.newClipCancellation()`, you can pass an optional parameter which will be the result.

```javascript
const cancellation = PFTween.newClipCancellation('Spark AR is awesome');
TouchGestures.onTap().subscribe(cancellation.cancel);

const clip1 = new PFTween(0, 1, 1000).clip;
const clip2 = new PFTween(1, 2, 1000).clip;
const clip3 = new PFTween(2, 3, 1000).clip;

clip1().then(clip2).then(clip3)
    .then(Diagnostics.log)	// {"value":"Spark AR is awesome"}
	.catch(Diagnostics.log)	// {...}
```

By calling the `cancellation.cancel()`, you can interrupt the clips chain, and you can catch the reason. The reason is an object containing the following properties:

- `message`:  "canceled"
- `value`: The parameter you passed to the cancellation, which should be the result of clip
- `lastValue`: The value when you interrupt clips
- `lastTweener`:  The tweener which be interrupted

Following is a catched error sample of above code:

```json
{
    "message": "canceled",
	"value": "Spark AR is awesome",
    "lastValue": 1.3,
    "lastTweener": {}
}
```

Please note that `lastTweener` does not display anything in the Spark AR console, but it's acturally the `clip2` in this example.

 
