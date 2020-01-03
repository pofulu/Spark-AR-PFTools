const Animation = require('Animation');
const Reactive = require('Reactive');
const Time = require('Time');
const Diagnostics = require('Diagnostics');

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
        ],
        knots: [0, 1, 2, 3, 4]
    }),
};

const degreeToRadian = Math.PI / 180;
let privates = instantiatePrivateMap();

class PFTween {
    constructor(from, to, durationMilliseconds) {
        privates(this).from = typeof from.pinLastValue === 'function' ? from.pinLastValue() : from;
        privates(this).to = typeof to.pinLastValue === 'function' ? to.pinLastValue() : to;
        privates(this).duration = durationMilliseconds;
        privates(this).start = [];
        privates(this).complete = [];
        privates(this).update = [];
        privates(this).loop = [];

        this.setEase(samplers.linear);
    }

    setMirror(isMirror = true) {
        privates(this).isMirror = isMirror;
        return this;
    }

    setLoop(loopCount = Infinity) {
        privates(this).loopCount = loopCount;
        return this;
    }

    /**
     * @param {{(from: number,to: number):ScalarSampler}} ease 
     */
    setEase(ease) {
        privates(this).sampler = ease(
            privates(this).from,
            privates(this).to
        );
        return this;
    }

    /**
     * @param {number} delayMilliseconds 
     */
    setDelay(delayMilliseconds) {
        privates(this).delay = delayMilliseconds;
        return this;
    }

    /**
     * @param {{(tweener: PFTweener) : void}} call 
     */
    bind(call) {
        privates(this).update.push(call);
        return this;
    }

    /**
     * @param {{(iteration: number) : void}} call
     */
    onLooped(call) {
        privates(this).loop.push(call);
        return this;
    }

    /**
     * @param {{() : void}} call
     */
    onStart(call) {
        privates(this).start.push(call);
        return this;
    }

    /**
     * @param {{() : void}} call
     */
    onCompleted(call) {
        privates(this).complete.push(call);
        return this;
    }

    /**
     * @param {SceneObjectBase} sceneObject
     */
    onStartVisible(sceneObject) {
        privates(this).start.push(() => sceneObject.hidden = Reactive.val(false));
        return this;
    }

    /**
     * @param {SceneObjectBase} sceneObject
     */
    onStartHidden(sceneObject) {
        privates(this).start.push(() => sceneObject.hidden = Reactive.val(true));
        return this;
    }

    /**
     * @param {SceneObjectBase} sceneObject
     */
    onCompleteVisible(sceneObject) {
        privates(this).complete.push(() => sceneObject.hidden = Reactive.val(false));
        return this;
    }

    /**
     * @param {SceneObjectBase} sceneObject
     */
    onCompleteHidden(sceneObject) {
        privates(this).complete.push(() => sceneObject.hidden = Reactive.val(true));
        return this;
    }

    /**
     * @param {SceneObjectBase} sceneObject 
     */
    onCompleteResetPosition(sceneObject) {
        const originPositionX = sceneObject.transform.x.pinLastValue();
        const originPositionY = sceneObject.transform.y.pinLastValue();
        const originPositionZ = sceneObject.transform.z.pinLastValue();
        privates(this).complete.push(() => {
            sceneObject.transform.x = originPositionX;
            sceneObject.transform.y = originPositionY;
            sceneObject.transform.z = originPositionZ;
        });
        return this;
    }

    /**
     * @param {SceneObjectBase} sceneObject
     */
    onCompleteResetRotation(sceneObject) {
        const originRotationX = sceneObject.transform.rotationX.pinLastValue();
        const originRotationY = sceneObject.transform.rotationY.pinLastValue();
        const originRotationZ = sceneObject.transform.rotationZ.pinLastValue();
        privates(this).complete.push(() => {
            sceneObject.transform.rotationX = originRotationX;
            sceneObject.transform.rotationY = originRotationY;
            sceneObject.transform.rotationZ = originRotationZ;
        });
        return this;
    }

    /**
     * @param {SceneObjectBase} sceneObject
     */
    onCompleteResetScale(sceneObject) {
        const originScaleX = sceneObject.transform.scaleX.pinLastValue();
        const originScaleY = sceneObject.transform.scaleY.pinLastValue();
        const originScaleZ = sceneObject.transform.scaleZ.pinLastValue();
        privates(this).complete.push(() => {
            sceneObject.transform.scale = Reactive.scale(originScaleX, originScaleY, originScaleZ);
        });
        return this;
    }

    onCompleteResetOpacity(sceneObject) {
        const originOpacity = sceneObject.material.opacity.pinLastValue();
        privates(this).complete.push(() => {
            sceneObject.material.opacity = originOpacity;
        });
        return this;
    }

    apply(autoPlay = true) {
        return animate(privates(this), autoPlay);
    }

    /**@returns {Promise<void>} - get `promise` will start animation immediately*/
    get promise() {
        const promise = new Promise((resolve, reject) => {
            privates(this).complete.push(() => resolve());

            if (privates(this).loopCount == Infinity) {
                reject('Set infinite loop will stuck the promise in PFTween.');
            }
            
            animate(privates(this), true);
        })

        return promise;
    }

    get log() {
        return privates(this)
    }

    get scalar() {
        return animate(privates(this), true).scalar;
    }

    get scale() {
        return animate(privates(this), true).scale;
    }

    get pack3() {
        return animate(privates(this), true).pack3;
    }

    get pack4() {
        return animate(privates(this), true).pack4;
    }

    get rotation() {
        return animate(privates(this), true).rotation;
    }
}

class PFTweener {
    constructor(driver, animate, delay, start, update) {
        privates(this).delay = delay;
        privates(this).animate = animate;
        privates(this).driver = driver;
        privates(this).onStart = start;
        privates(this).onUpdate = update;
    }

    replay() {
        this.reset();
        this.start();
    }

    reset() {
        privates(this).driver.reset();
    }

    reverse() {
        privates(this).driver.reverse();
    }

    start() {
        const play = () => {
            invoke(privates(this).onStart);
            invoke(privates(this).onUpdate, this);
            privates(this).driver.start();
        }

        if (privates(this).delay != undefined) {
            Time.setTimeout(play, privates(this).delay);
        } else {
            play();
        }
    }

    stop() {
        privates(this).driver.stop();
    }

    /**@returns {BoolSignal} */
    get isRuning() {
        return privates(this).driver.isRunning();
    }

    /**@returns {ScalarSignal} */
    get scalar() {
        return privates(this).animate;
    }

    /**@returns {ScaleSignal} */
    get scale() {
        const scalar = this.scalar;
        return Reactive.scale(scalar, scalar, scalar);
    }

    /**@returns {PointSignal} */
    get pack3() {
        const scalar = this.scalar
        return Reactive.pack3(scalar, scalar, scalar);
    }

    /**@returns {Point4DSignal} */
    get pack4() {
        const scalar = this.scalar
        return Reactive.pack4(scalar, scalar, scalar, scalar);
    }

    /**@returns {ScalarSignal} */
    get rotation() {
        const scalar = this.scalar
        return scalar.mul(degreeToRadian);
    }
}

function animate(config, autoPlay) {
    const driver = Animation.timeDriver({
        durationMilliseconds: config.duration,
        loopCount: config.loopCount,
        mirror: config.isMirror
    });

    driver.onCompleted().subscribe(() => invoke(config.complete));
    driver.onAfterIteration().subscribe(index => invoke(config.loop, index));

    const animate = Animation.animate(driver, config.sampler);
    const tweener = new PFTweener(driver, animate, config.delay, config.start, config.update);

    if (autoPlay) tweener.start();

    return tweener;
}

function invoke(calls, arg) {
    for (let i = 0; i < calls.length; i++) {
        calls[i](arg);
    }
}

function instantiatePrivateMap() {
    const map = new WeakMap();
    return obj => {
        let props = map.get(obj);
        if (!props) {
            props = {};
            map.set(obj, props);
        }
        return props;
    };
}

export { PFTween, samplers as Ease };