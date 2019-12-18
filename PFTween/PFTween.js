const Animation = require('Animation');
const Reactive = require('Reactive');
const Time = require('Time');
const Diagnostics = require('Diagnostics');

const ease = {
    linear: 'linear',
    easeInQuad: 'easeInQuad',
    easeOutQuad: 'easeOutQuad',
    easeInOutQuad: 'easeInOutQuad',
    easeInCubic: 'easeInCubic',
    easeOutCubic: 'easeOutCubic',
    easeInOutCubic: 'easeInOutCubic',
    easeInQuart: 'easeInQuart',
    easeOutQuart: 'easeOutQuart',
    easeInOutQuart: 'easeInOutQuart',
    easeInQuint: 'easeInQuint',
    easeOutQuint: 'easeOutQuint',
    easeInOutQuint: 'easeInOutQuint',
    easeInSine: 'easeInSine',
    easeOutSine: 'easeOutSine',
    easeInOutSine: 'easeInOutSine',
    easeInExpo: 'easeInExpo',
    easeOutExpo: 'easeOutExpo',
    easeInOutExpo: 'easeInOutExpo',
    easeInCirc: 'easeInCirc',
    easeOutCirc: 'easeOutCirc',
    easeInOutCirc: 'easeInOutCirc',
    easeInBack: 'easeInBack',
    easeOutBack: 'easeOutBack',
    easeInOutBack: 'easeInOutBack',
    easeInElastic: 'easeInElastic',
    easeOutElastic: 'easeOutElastic',
    easeInOutElastic: 'easeInOutElastic',
    easeInBounce: 'easeInBounce',
    easeOutBounce: 'easeOutBounce',
    easeInOutBounce: 'easeInOutBounce',
    punch: 'punch'
};

const samplers = {
    linear: (from, to) => Animation.samplers.linear(from, to),
    easeInQuad: (from, to) => Animation.samplers.easeInQuad(from, to),
    easeOutQuad: (from, to) => Animation.samplers.easeOutQuad(from, to),
    easeInOutQuad: (from, to) => Animation.samplers.easeInOutQuad(from, to),
    easeInCubic: (from, to) => Animation.samplers.easeInCubic(from, to),
    easeOutCubic: (from, to) => Animation.samplers.easeOutCubic(from, to),
    easeInOutCubic: (from, to) => Animation.samplers.easeInOutCubic(from, to),
    easeInQuart: (from, to) => Animation.samplers.easeInQuart(from, to),
    easeOutQuart: (from, to) => Animation.samplers.easeOutQuart(from, to),
    easeInOutQuart: (from, to) => Animation.samplers.easeInOutQuart(from, to),
    easeInQuint: (from, to) => Animation.samplers.easeInQuint(from, to),
    easeOutQuint: (from, to) => Animation.samplers.easeOutQuint(from, to),
    easeInOutQuint: (from, to) => Animation.samplers.easeInOutQuint(from, to),
    easeInSine: (from, to) => Animation.samplers.easeInSine(from, to),
    easeOutSine: (from, to) => Animation.samplers.easeOutSine(from, to),
    easeInOutSine: (from, to) => Animation.samplers.easeInOutSine(from, to),
    easeInExpo: (from, to) => Animation.samplers.easeInExpo(from, to),
    easeOutExpo: (from, to) => Animation.samplers.easeOutExpo(from, to),
    easeInOutExpo: (from, to) => Animation.samplers.easeInOutExpo(from, to),
    easeInCirc: (from, to) => Animation.samplers.easeInCirc(from, to),
    easeOutCirc: (from, to) => Animation.samplers.easeOutCirc(from, to),
    easeInOutCirc: (from, to) => Animation.samplers.easeInOutCirc(from, to),
    easeInBack: (from, to) => Animation.samplers.easeInBack(from, to),
    easeOutBack: (from, to) => Animation.samplers.easeOutBack(from, to),
    easeInOutBack: (from, to) => Animation.samplers.easeInOutBack(from, to),
    easeInElastic: (from, to) => Animation.samplers.easeInElastic(from, to),
    easeOutElastic: (from, to) => Animation.samplers.easeOutElastic(from, to),
    easeInOutElastic: (from, to) => Animation.samplers.easeInOutElastic(from, to),
    easeInBounce: (from, to) => Animation.samplers.easeInBounce(from, to),
    easeOutBounce: (from, to) => Animation.samplers.easeOutBounce(from, to),
    easeInOutBounce: (from, to) => Animation.samplers.easeInOutBounce(from, to),
    punch: (from, amount) => Animation.samplers.polyline({
        keyframes: [
            from + (amount / 5) * 4,
            from - (amount / 5) * 3,
            from + (amount / 5) * 2,
            from - (amount / 5) * 1,
            from
        ]
        , knots: [
            0, 1, 2, 3, 4
        ]
    })
};

let privates = new WeakMap();

class PFTween {
    constructor(from, to, durationMilliseconds) {
        const _from = typeof from.pinLastValue === 'function' ? from.pinLastValue() : from;
        const _to = typeof to.pinLastValue === 'function' ? to.pinLastValue() : to;

        privates.set(this, {
            from: _from,
            to: _to,
            duration: durationMilliseconds,
            sampler: Animation.samplers.linear(_from, _to),
            start: [],
            complete: [],
            update: []
        });

        return this;
    }

    setMirror(isMirror = true) {
        let data = privates.get(this);
        data.isMirror = isMirror;
        privates.set(this, data);
        return this;
    }

    setLoop(loopCount = Infinity) {
        let data = privates.get(this);
        data.loopCount = loopCount;
        privates.set(this, data);
        return this;
    }

    setEase(ease) {
        let data = privates.get(this);
        data.sampler = samplers[ease](data.from, data.to);
        privates.set(this, data);
        return this;
    }

    setDelay(delayMilliseconds) {
        let data = privates.get(this);
        data.delay = delayMilliseconds;
        privates.set(this, data);
        return this;
    }

    onUpdate(call) {
        let data = privates.get(this);
        data.update.push(call);
        privates.set(this, data);
        return this;
    }

    onStart(call) {
        let data = privates.get(this);
        data.start.push(call);
        privates.set(this, data);
        return this;
    }

    onCompleted(call) {
        let data = privates.get(this);
        data.complete.push(call);
        privates.set(this, data);
        return this;
    }

    onStartVisible(sceneObject) {
        let data = privates.get(this);
        data.start.push(() => sceneObject.hidden = false);
        privates.set(this, data);
        return this;
    }

    onStartHidden(sceneObject) {
        let data = privates.get(this);
        data.start.push(() => sceneObject.hidden = true);
        privates.set(this, data);
        return this;
    }

    onCompleteVisible(sceneObject) {
        let data = privates.get(this);
        data.complete.push(() => sceneObject.hidden = false);
        privates.set(this, data);
        return this;
    }

    onCompleteHidden(sceneObject) {
        let data = privates.get(this);
        data.complete.push(() => sceneObject.hidden = true);
        privates.set(this, data);
        return this;
    }

    onCompleteResetPosition(sceneObject) {
        let data = privates.get(this);
        const originRotationX = sceneObject.transform.rotationX.pinLastValue();
        const originRotationY = sceneObject.transform.rotationX.pinLastValue();
        const originRotationZ = sceneObject.transform.rotationX.pinLastValue();
        data.complete.push(() => {
            sceneObject.transform.rotationX = originRotationX;
            sceneObject.transform.rotationY = originRotationY;
            sceneObject.transform.rotationZ = originRotationZ;
        });
        privates.set(this, data);
        return this;
    }

    onCompleteResetRotation(sceneObject) {
        let data = privates.get(this);
        const originOpacity = sceneObject.material.opacity.pinLastValue();
        data.complete.push(() => {
            sceneObject.material.opacity = originOpacity;
        });
        privates.set(this, data);
        return this;
    }

    onCompleteResetOpacity(sceneObject) {
        let data = privates.get(this);
        const originOpacity = sceneObject.material.opacity.pinLastValue();
        data.complete.push(() => {
            sceneObject.material.opacity = originOpacity;
        });
        privates.set(this, data);
        return this;
    }

    onCompleteResetScale(sceneObject) {
        let data = privates.get(this);
        const originScaleX = sceneObject.transform.scaleX.pinLastValue();
        const originScaleY = sceneObject.transform.scaleX.pinLastValue();
        const originScaleZ = sceneObject.transform.scaleX.pinLastValue();
        data.complete.push(() => {
            sceneObject.transform.scale = Reactive.scale(originScaleX, originScaleY, originScaleZ);
        });
        privates.set(this, data);
        return this;
    }

    apply(autoPlay = true) {
        return animate(privates.get(this), autoPlay);
    }

    get log() {
        return privates.get(this);
    }

    get scalar() {
        return animate(privates.get(this), true).scalar;
    }

    get scale() {
        return animate(privates.get(this), true).scale;
    }

    get pack3() {
        return animate(privates.get(this), true).pack3;
    }

    get pack4() {
        return animate(privates.get(this), true).pack4;
    }

    get rotation() {
        return animate(privates.get(this), true).rotation;
    }
}

class Tweener {
    constructor(driver, animate, delay, start, update) {
        this.delay = delay;
        this.animate = animate;
        this.driver = driver;
        this.onStart = start;
        this.onUpdate = update;
    }

    replay() {
        this.reset();
        this.start();
    }

    reset() {
        this.driver.reset();
    }

    reverse() {
        this.driver.reverse();
    }

    start() {
        const play = () => {
            if (this.onStart.length != 0)
                invoke(this.onStart);

            if (this.onUpdate.length != 0)
                invoke(this.onUpdate, this.animate);

            this.driver.start();
        }

        if (this.delay != undefined) {
            Time.setTimeout(play, this.delay);
        } else {
            play();
        }
    }

    stop() {
        this.driver.start();
    }

    get isRuning() {
        return this.driver.isRuning;
    }

    get scalar() {
        return this.animate;
    }

    get scale() {
        const scalar = this.scalar;
        return Reactive.scale(scalar, scalar, scalar);
    }

    get pack3() {
        const scalar = this.scalar
        return Reactive.pack3(scalar, scalar, scalar);
    }

    get pack4() {
        const scalar = this.scalar
        return Reactive.pack4(scalar, scalar, scalar, scalar);
    }

    get rotation() {
        const scalar = this.scalar
        return scalar.mul(Math.PI / 180);
    }
}

function animate(config, autoPlay) {
    const driver = Animation.timeDriver({
        durationMilliseconds: config.duration,
        loopCount: config.loopCount,
        mirror: config.isMirror
    });

    const animate = Animation.animate(driver, config.sampler);

    if (config.complete.length != 0) {
        driver.onCompleted().subscribe(() => invoke(config.complete));
    }

    const tweener = new Tweener(driver, animate, config.delay, config.start, config.update);

    if (autoPlay) {
        tweener.start();
    }

    return tweener;
}

function invoke(calls, arg) {
    for (let i = 0; i < calls.length; i++) {
        calls[i](arg);
    }
}

export { PFTween, ease };