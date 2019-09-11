# PFTween
PFTween is a wrapped Spark AR animation function. You can handle animation just like [DOTween](http://dotween.demigiant.com) in Unity.

## How to use
Just copy/paste full PFTween function to your script in Spark AR. There is only one script accepted in Spark AR.

## Example
Let's say you want to scale a plane:
```javascript
const Scene = require('Scene'); 

const plane0 = Scene.root.find('plane0');

plane0.transform.scale = new PFTween(0, 1, 1000).ToScale();
```

You can also change ease type:
```javascript
plane0.transform.scale = new PFTween(0, 1, 1000).SetEase('easeOutBack').ToScale();
```

or make it loop:
```javascript
plane0.transform.scale = new PFTween(0, 1, 1000).SetLoop().SetMirror().ToScale();
```

or combine them:
```javascript
plane0.transform.scale = 
new PFTween(0, 1, 1000)
.SetEase('easeInOutExpo')
.SetLoop()
.SetMirror()
.ToScale();   // the value type of 'poisition.scale' is 'scale'
```

You can even `SetDelay`, `SetCallback`, and apply animation to position or anything you want.
```javascript
const Scene = require('Scene'); 
const Diagnostics = require('Diagnostics'); 

const plane0 = Scene.root.find('plane0');

plane0.transform.x = 
new PFTween(plane0.tranform.x, 10, 1000)
.SetLoop(2)
.SetMirror(true)
.SetEase('easeInOutExpo')
.SetDelay(1500)
.SetVisibleOnStart(plane0)    // this plane will be visible when animation start
.SetHiddenOnCompleted(plane0) // and will be hidden on completed
.OnLoop(() => Diagnostics.log('loop!'))
.OnComplete(() => Diagnostics.log('completed!'))
.ToSignal();                  // the value type 'poisition.x' is 'scalar'
```

## Known Issues
You must set `OnLoop` and `OnComplete` at the end of your PFTween chain, or it maybe not work with right logic.
