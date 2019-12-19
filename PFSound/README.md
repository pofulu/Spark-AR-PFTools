# PFSound
PFSound is a wrapped Spark AR audio function.

## How to use

0. [Download PFSound](https://github.com/pofulu/Spark-AR-PFTools/raw/master/PFSound/PFSound.js) (Right click and Save as)

1. Drap/Import to Assets caetgory in Spark AR. (Spark AR support multiple script files after [v75](https://sparkar.facebook.com/ar-studio/learn/documentation/changelog#75))

2. Import  `PFSound` module at the top of your main script.
```javascript
import { PFSound } from './PFSound';

// Your script...
```

3. Make sure your "speaker on the scene", and "audio playback controller" have the SAME name.

## Example
```javascript
import { PFSound } from './PFSound';

const TouchGestures = require('TouchGestures');

const bgm = new PFSound('bgm', true, true, 1);
const sfx = new PFSound('sfx');

let isPlayBGM = true;

TouchGestures.onTap().subscribe(() => sfx.play());
TouchGestures.onLongPress().subscribe(toggleFadeBGM);

function toggleFadeBGM(){
    isPlayBGM = !isPlayBGM;
    
    if(isPlayBGM){
        bgm.resume(1000);   // bgm will resume play and fadein volume in 1000 millisecond.
    }else{
        bgm.pause(1000);    // bgm will fadeout volume in 1000 millisecond and pause.
    }
}
```
