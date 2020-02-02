/*!
 * weakmap-polyfill v2.0.0 - ECMAScript6 WeakMap polyfill
 * https://github.com/polygonplanet/weakmap-polyfill
 * Copyright (c) 2015-2016 polygon planet <polygon.planet.aqua@gmail.com>
 * @license MIT
 */
(function (e) { "use strict"; if (e.WeakMap) { return } var t = Object.prototype.hasOwnProperty; var r = function (e, t, r) { if (Object.defineProperty) { Object.defineProperty(e, t, { configurable: true, writable: true, value: r }) } else { e[t] = r } }; e.WeakMap = function () { function WeakMap() { if (this === void 0) { throw new TypeError("Constructor WeakMap requires 'new'") } r(this, "_id", genId("_WeakMap")); if (arguments.length > 0) { throw new TypeError("WeakMap iterable is not supported") } } r(WeakMap.prototype, "delete", function (e) { checkInstance(this, "delete"); if (!isObject(e)) { return false } var t = e[this._id]; if (t && t[0] === e) { delete e[this._id]; return true } return false }); r(WeakMap.prototype, "get", function (e) { checkInstance(this, "get"); if (!isObject(e)) { return void 0 } var t = e[this._id]; if (t && t[0] === e) { return t[1] } return void 0 }); r(WeakMap.prototype, "has", function (e) { checkInstance(this, "has"); if (!isObject(e)) { return false } var t = e[this._id]; if (t && t[0] === e) { return true } return false }); r(WeakMap.prototype, "set", function (e, t) { checkInstance(this, "set"); if (!isObject(e)) { throw new TypeError("Invalid value used as weak map key") } var n = e[this._id]; if (n && n[0] === e) { n[1] = t; return this } r(e, this._id, [e, t]); return this }); function checkInstance(e, r) { if (!isObject(e) || !t.call(e, "_id")) { throw new TypeError(r + " method called on incompatible receiver " + typeof e) } } function genId(e) { return e + "_" + rand() + "." + rand() } function rand() { return Math.random().toString().substring(2) } r(WeakMap, "_polyfill", true); return WeakMap }(); function isObject(e) { return Object(e) === e } })(typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);


const Animation = require('Animation');
const Reactive = require('Reactive');
const Time = require('Time');
const Diagnostics = require('Diagnostics');

const samplers = {
    linear: (begin, end) => Animation.samplers.linear(begin, end),
    easeInQuad: (begin, end) => Animation.samplers.easeInQuad(begin, end),
    easeOutQuad: (begin, end) => Animation.samplers.easeOutQuad(begin, end),
    easeInOutQuad: (begin, end) => Animation.samplers.easeInOutQuad(begin, end),
    easeInCubic: (begin, end) => Animation.samplers.easeInCubic(begin, end),
    easeOutCubic: (begin, end) => Animation.samplers.easeOutCubic(begin, end),
    easeInOutCubic: (begin, end) => Animation.samplers.easeInOutCubic(begin, end),
    easeInQuart: (begin, end) => Animation.samplers.easeInQuart(begin, end),
    easeOutQuart: (begin, end) => Animation.samplers.easeOutQuart(begin, end),
    easeInOutQuart: (begin, end) => Animation.samplers.easeInOutQuart(begin, end),
    easeInQuint: (begin, end) => Animation.samplers.easeInQuint(begin, end),
    easeOutQuint: (begin, end) => Animation.samplers.easeOutQuint(begin, end),
    easeInOutQuint: (begin, end) => Animation.samplers.easeInOutQuint(begin, end),
    easeInSine: (begin, end) => Animation.samplers.easeInSine(begin, end),
    easeOutSine: (begin, end) => Animation.samplers.easeOutSine(begin, end),
    easeInOutSine: (begin, end) => Animation.samplers.easeInOutSine(begin, end),
    easeInExpo: (begin, end) => Animation.samplers.easeInExpo(begin, end),
    easeOutExpo: (begin, end) => Animation.samplers.easeOutExpo(begin, end),
    easeInOutExpo: (begin, end) => Animation.samplers.easeInOutExpo(begin, end),
    easeInCirc: (begin, end) => Animation.samplers.easeInCirc(begin, end),
    easeOutCirc: (begin, end) => Animation.samplers.easeOutCirc(begin, end),
    easeInOutCirc: (begin, end) => Animation.samplers.easeInOutCirc(begin, end),
    easeInBack: (begin, end) => Animation.samplers.easeInBack(begin, end),
    easeOutBack: (begin, end) => Animation.samplers.easeOutBack(begin, end),
    easeInOutBack: (begin, end) => Animation.samplers.easeInOutBack(begin, end),
    easeInElastic: (begin, end) => Animation.samplers.easeInElastic(begin, end),
    easeOutElastic: (begin, end) => Animation.samplers.easeOutElastic(begin, end),
    easeInOutElastic: (begin, end) => Animation.samplers.easeInOutElastic(begin, end),
    easeInBounce: (begin, end) => Animation.samplers.easeInBounce(begin, end),
    easeOutBounce: (begin, end) => Animation.samplers.easeOutBounce(begin, end),
    easeInOutBounce: (begin, end) => Animation.samplers.easeInOutBounce(begin, end),
    punch: (begin, amount) => Animation.samplers.polyline({
        keyframes: [
            begin + (amount / 5) * 4,
            begin - (amount / 5) * 3,
            begin + (amount / 5) * 2,
            begin - (amount / 5) * 1,
            begin
        ],
        knots: [0, 1, 2, 3, 4]
    }),
};

const degreeToRadian = Math.PI / 180;
const privates = instantiatePrivateMap();

class PFTween {
    constructor(begin, end, durationMilliseconds) {
        privates(this).duration = durationMilliseconds;
        privates(this).start = [];
        privates(this).complete = [];
        privates(this).update = [];
        privates(this).loop = [];
        privates(this).sampler = samplers.linear(
            typeof begin.pinLastValue === 'function' ? begin.pinLastValue() : begin,
            typeof end.pinLastValue === 'function' ? end.pinLastValue() : end
        );
    }

    /**
     * @param {{(tweener: PFTweener) : void}} setter
     */
    static To(getter, setter, end, durationMilliseconds) {
        return new PFTween(getter, end, durationMilliseconds).bind(setter);
    }

    /**
     * @param  {...any} clips 
     */
    static combine(...clips) {
        return result =>
            Promise.all(clips.map(i => i())).then(endValues =>
                Promise.resolve(result != undefined ? result : endValues)
            );
    }

    /**
     * @returns {{(result?:any):Promise<any>}}
     */
    static concat(...clips) {
        return result => {
            const firstClip = clips.shift();
            return clips.reduce((pre, cur) => pre.then(cur), firstClip(result));
        }
    }

    /**
     * If `isMirror` is not assigned, mirror animation is enabled by default.
     * @param {boolean=} isMirror 
     */
    setMirror(isMirror = true) {
        privates(this).isMirror = isMirror;
        return this;
    }

    /**
     * If `loopCount` is not assigned, it will be an infinite loop.
     * @param {number=} loopCount 
     */
    setLoops(loopCount = Infinity) {
        privates(this).loopCount = loopCount;
        return this;
    }

    setBegin(number) {
        privates(this).sampler.begin = typeof number.pinLastValue === 'function' ? number.pinLastValue() : number;
        return this;
    }

    setEnd(number) {
        privates(this).sampler.end = typeof number.pinLastValue === 'function' ? number.pinLastValue() : number;
        return this;
    }

    /**
     * @param {{(begin: number, end: number):ScalarSampler}} ease 
     */
    setEase(ease) {
        privates(this).sampler = ease(privates(this).sampler.begin, privates(this).sampler.end);
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
    onLoop(call) {
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
    onComplete(call) {
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
        privates(this).complete.push(() => {
            sceneObject.transform.position = Reactive.pack3(
                sceneObject.transform.x.pinLastValue(),
                sceneObject.transform.y.pinLastValue(),
                sceneObject.transform.z.pinLastValue(),
            );
        });
        return this;
    }

    /**
     * @param {SceneObjectBase} sceneObject
     */
    onCompleteResetRotation(sceneObject) {
        privates(this).complete.push(() => {
            sceneObject.transform.rotationX = sceneObject.transform.rotationX.pinLastValue();
            sceneObject.transform.rotationY = sceneObject.transform.rotationY.pinLastValue();
            sceneObject.transform.rotationZ = sceneObject.transform.rotationZ.pinLastValue();
        });
        return this;
    }

    /**
     * @param {SceneObjectBase} sceneObject
     */
    onCompleteResetScale(sceneObject) {
        privates(this).complete.push(() => {
            sceneObject.transform.scale = Reactive.scale(
                sceneObject.transform.scaleX.pinLastValue(),
                sceneObject.transform.scaleY.pinLastValue(),
                sceneObject.transform.scaleZ.pinLastValue(),
            );
        });
        return this;
    }

    /**
     * Please note that this can only be used on `SceneObject` containing material property.
     * @param {SceneObjectBase} sceneObject
     */
    onCompleteResetOpacity(sceneObject) {
        privates(this).complete.push(() => {
            sceneObject.material.opacity = sceneObject.material.opacity.pinLastValue();
        });
        return this;
    }

    apply(autoPlay = true) {
        return animate(privates(this), autoPlay);
    }

    get clip() {
        const completePromise = result =>
            new Promise(resolve => privates(this).complete.push(() =>
                resolve(result != undefined ? result : privates(this).sampler.end))
            );

        if (privates(this).loopCount == Infinity) {
            Diagnostics.log('Please note that set infinite loop will stuck the clips chain.');
        }

        return this.apply(false).getPromise(completePromise);
    }

    get log() {
        return privates(this)
    }

    get scalar() {
        return this.apply(true).scalar;
    }

    get scale() {
        return this.apply(true).scale;
    }

    get pack2() {
        return this.apply(true).pack2;
    }

    get pack3() {
        return this.apply(true).pack3;
    }

    get pack4() {
        return this.apply(true).pack4;
    }

    get rotation() {
        return this.apply(true).rotation;
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

    /**
     * Generally, you should get `clip` directly instead of `apply()` and then call this function. The animation will replay immediately when call this funtion.
     * @param {{(result?:any):Promise<any>}} promise
     * @returns {{(result?:any):Promise<any>}}
     */
    getPromise(promise) {
        return result => {
            this.replay();
            return promise(result);
        };
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
    get isRunning() {
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

    /**@returns {Point2DSignal} */
    get pack2() {
        const scalar = this.scalar
        return Reactive.pack2(scalar, scalar);
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

    /**@returns {ScalarSignal} convert degree to radian*/
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