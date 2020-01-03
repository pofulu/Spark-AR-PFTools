const Audio = require('Audio');
const Scene = require('Scene');
const Animation = require('Animation');

let privates = new WeakMap();

class PFSound {
    /**
     * 
     * @param {String} name - The name of 'Speaker' and 'AudioPlaybackController', both they must have the same name.
     * @param {Boolean} [playOnAwake] 
     * @param {Boolean} [loop]
     * @param {Number} [initVolumn]
     */
    constructor(name, playOnAwake = false, loop = false, initVolumn = undefined) {
        let _this = {};
        _this.speaker = Scene.root.find(name);
        _this.controller = Audio.getPlaybackController(name);
        _this.startVolumn = initVolumn == undefined ? _this.speaker.volume.pinLastValue() : initVolumn;
        _this.toStopPlaying = false;

        if (initVolumn != undefined) {
            _this.speaker.volume = initVolumn;
        }

        _this.controller.setPlaying(playOnAwake);
        _this.controller.setLooping(loop);

        privates.set(this, _this);
    }

    /**
     * Play the sound from beginning immediately.
     * @param {number} [fadeDuration] - The duration of fade curretn volume to 'startVolumn' when play.
     */
    play(fadeDuration) {
        const _this = privates.get(this);

        _this.toStopPlaying = false;

        _this.controller.setPlaying(true);
        _this.controller.reset();

        if (fadeDuration != undefined) {
            _this.speaker.volume = Animate(_this.speaker.volume.pinLastValue(), _this.startVolumn, fadeDuration);
        }
        else {
            _this.speaker.volume = _this.startVolumn;
        }

        privates.set(this, _this);
    }

    /**
     * 
     * @param {number} [fadeDuration] - The duration of fade current volume to 0 and then pause.
     * @see resume
     */
    pause(fadeDuration) {
        const _this = privates.get(this);
        _this.toStopPlaying = true;

        if (fadeDuration == undefined) {
            _this.controller.setPlaying(false);
        } else {
            _this.speaker.volume = Animate(_this.speaker.volume.pinLastValue(), 0, fadeDuration, () => {
                if (_this.toStopPlaying) {
                    _this.controller.setPlaying(false);
                }
            });
        }
        privates.set(this, _this);
    }

    /**
     * Resume the sound from pause.
     * @param {number} [fadeDuration] - The duration of fade current volume to 'startVolumn'.
     * @see pause
     */
    resume(fadeDuration) {
        const _this = privates.get(this);
        _this.toStopPlaying = false;

        _this.controller.setPlaying(true);

        if (fadeDuration != undefined)
            _this.speaker.volume = Animate(_this.speaker.volume.pinLastValue(), _this.startVolumn, fadeDuration);
        else
            _this.speaker.volume = _this.startVolumn;
        privates.set(this, _this);
    }

    /**
     * Stop playing the sound and reset to the beginning.
     * @param {number} [fadeDuration] - The duration of fade current volume to 0 and then stop.
     */
    stop(fadeDuration) {
        const _this = privates.get(this);
        _this.toStopPlaying = true;

        if (fadeDuration == undefined) {
            _this.controller.setPlaying(false);
            _this.controller.reset();
        } else {
            _this.speaker.volume = Animate(_this.speaker.volume.pinLastValue(), 0, fadeDuration, () => {
                if (_this.toStopPlaying) {
                    _this.controller.setPlaying(false);
                    _this.controller.reset();
                }
            });
        }
        privates.set(this, _this);
    }

    /**
     * Set volume of speaker and 'startVolumn'.
     * @param {number|ScalarSignal} volume - Volume range is 0~1
     */
    setVolume(volume) {
        const _this = privates.get(this);
        _this.startVolumn = volume;
        _this.speaker.volume = volume;
        privates.set(this, _this);
    }

    fadeVolume(duration, toValue) {
        const _this = privates.get(this);
        _this.speaker.volume = Animate(_this.speaker.volume.pinLastValue(), toValue, duration);
        privates.set(this, _this);
    }

    animateVolume(duration, from, toValue) {
        const _this = privates.get(this);
        _this.speaker.volume = Animate(from, toValue, duration);
        privates.set(this, _this);
    }

    /**
     * @returns {number}
     */
    get volume() {
        const _this = privates.get(this);
        return _this.speaker.volume.pinLastValue();
    }
}

function Animate(from, to, durationMilliseconds, onCompleted) {
    const dirver = Animation.timeDriver({ durationMilliseconds: durationMilliseconds, loopCount: 1, mirror: false })
    const samplers = Animation.samplers.easeInOutSine(from, to);
    const animate = Animation.animate(dirver, samplers);
    if (onCompleted != undefined)
        dirver.onCompleted().subscribe(onCompleted);
    dirver.start();
    return animate;
}

export { PFSound };
