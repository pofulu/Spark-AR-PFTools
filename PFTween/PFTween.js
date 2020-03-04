/*!
 * weakmap-polyfill v2.0.0 - ECMAScript6 WeakMap polyfill
 * https://github.com/polygonplanet/weakmap-polyfill
 * Copyright (c) 2015-2016 polygon planet <polygon.planet.aqua@gmail.com>
 * @license MIT
 */
(function (e) { "use strict"; if (e.WeakMap) { return } var t = Object.prototype.hasOwnProperty; var r = function (e, t, r) { if (Object.defineProperty) { Object.defineProperty(e, t, { configurable: true, writable: true, value: r }) } else { e[t] = r } }; e.WeakMap = function () { function WeakMap() { if (this === void 0) { throw new TypeError("Constructor WeakMap requires 'new'") } r(this, "_id", genId("_WeakMap")); if (arguments.length > 0) { throw new TypeError("WeakMap iterable is not supported") } } r(WeakMap.prototype, "delete", function (e) { checkInstance(this, "delete"); if (!isObject(e)) { return false } var t = e[this._id]; if (t && t[0] === e) { delete e[this._id]; return true } return false }); r(WeakMap.prototype, "get", function (e) { checkInstance(this, "get"); if (!isObject(e)) { return void 0 } var t = e[this._id]; if (t && t[0] === e) { return t[1] } return void 0 }); r(WeakMap.prototype, "has", function (e) { checkInstance(this, "has"); if (!isObject(e)) { return false } var t = e[this._id]; if (t && t[0] === e) { return true } return false }); r(WeakMap.prototype, "set", function (e, t) { checkInstance(this, "set"); if (!isObject(e)) { throw new TypeError("Invalid value used as weak map key") } var n = e[this._id]; if (n && n[0] === e) { n[1] = t; return this } r(e, this._id, [e, t]); return this }); function checkInstance(e, r) { if (!isObject(e) || !t.call(e, "_id")) { throw new TypeError(r + " method called on incompatible receiver " + typeof e) } } function genId(e) { return e + "_" + rand() + "." + rand() } function rand() { return Math.random().toString().substring(2) } r(WeakMap, "_polyfill", true); return WeakMap }(); function isObject(e) { return Object(e) === e } })(typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);

/*
 Symbol-ES6 v0.1.2
 ES6 Symbol polyfill in pure ES5.

 @license Copyright (c) 2017-2018 Rousan Ali, MIT License

 Codebase: https://github.com/rousan/symbol-es6
 Date: 28th Jan, 2018
*/
(function(g,f){"object"===typeof module&&"object"===typeof module.exports?module.exports=f(g):f(g)})("undefined"!==typeof window?window:global,function(g){var f=Object.defineProperty,r=Object.defineProperties,z=0,m=[],t=Array.prototype.slice,n="object"===typeof g.ES6?g.ES6:g.ES6={},u=Array.isArray,w=Object.prototype.toString,A=Array.prototype.push,B=function(){},C=function(b){return b},v=function(){},k=function(b,a){this._array=b;this._flag=a;this._nextIndex=0},p=function(b,a){this._string=b;this._flag=
    a;this._nextIndex=0},q=function(b){return null!==b&&("object"===typeof b||"function"===typeof b)},x=function(b,a){if("number"===typeof b.length&&0<=b.length&&"number"===typeof a.length&&0<=a.length){var d=Math.floor(b.length),c=Math.floor(a.length),e=0;for(b.length=d+c;e<c;++e)a.hasOwnProperty(e)&&(b[d+e]=a[e])}},y=function(b,a){if("function"!==typeof b||"function"!==typeof a)throw new TypeError("Child and Parent must be function type");b.prototype=Object.create(a.prototype);b.prototype.constructor=
    b},b=function d(a){a="undefined"===typeof a?"":String(a);if(this instanceof d)throw new TypeError("Symbol is not a constructor");var b=Object.create(d.prototype);r(b,{_description:{value:a},_isSymbol:{value:!0},_id:{value:z++}});return b};r(b,{"for":{value:function(a){a=String(a);for(var d=m.length,c,e=0;e<d;++e)if(c=m[e],c.key===a)return c.symbol;c={key:a,symbol:b(a)};m.push(c);return c.symbol},writable:!0,configurable:!0},keyFor:{value:function(a){if(!n.isSymbol(a))throw new TypeError(String(a)+
    " is not a symbol");for(var b=m.length,c,e=0;e<b;++e)if(c=m[e],c.symbol===a)return c.key},writable:!0,configurable:!0},hasInstance:{value:b("Symbol.hasInstance")},isConcatSpreadable:{value:b("Symbol.isConcatSpreadable")},iterator:{value:b("Symbol.iterator")},toStringTag:{value:b("Symbol.toStringTag")}});b.prototype.toString=function(){return"@@_____"+this._id+"_____"};b.prototype.valueOf=function(){return this};f(v.prototype,b.iterator.toString(),{value:function(){return this},writable:!0,configurable:!0});
    y(k,v);y(p,v);f(k.prototype,b.toStringTag.toString(),{value:"Array Iterator",configurable:!0});f(p.prototype,b.toStringTag.toString(),{value:"String Iterator",configurable:!0});k.prototype.next=function(){if(!(this instanceof k))throw new TypeError("Method Array Iterator.prototype.next called on incompatible receiver "+String(this));if(-1===this._nextIndex)return{done:!0,value:void 0};if(!("number"===typeof this._array.length&&0<=this._array.length))return this._nextIndex=-1,{done:!0,value:void 0};
    if(this._nextIndex<Math.floor(this._array.length)){if(1===this._flag)var a=[this._nextIndex,this._array[this._nextIndex]];else 2===this._flag?a=this._array[this._nextIndex]:3===this._flag&&(a=this._nextIndex);this._nextIndex++;return{done:!1,value:a}}this._nextIndex=-1;return{done:!0,value:void 0}};p.prototype.next=function(){if(!(this instanceof p))throw new TypeError("Method String Iterator.prototype.next called on incompatible receiver "+String(this));var a=new String(this._string);if(-1===this._nextIndex)return{done:!0,
    value:void 0};if(this._nextIndex<a.length)return a=a[this._nextIndex],this._nextIndex++,{done:!1,value:a};this._nextIndex=-1;return{done:!0,value:void 0}};var l=function(a,b){this._target=a;this._values=[];this._thisArg=b};l.prototype.spread=function(){var a=this;t.call(arguments).forEach(function(b){n.forOf(b,function(b){a._values.push(b)})});return a};l.prototype.add=function(){var a=this;t.call(arguments).forEach(function(b){a._values.push(b)});return a};l.prototype.call=function(a){if("function"!==
    typeof this._target)throw new TypeError("Target is not a function");a=0>=arguments.length?this._thisArg:a;return this._target.apply(a,this._values)};l.prototype["new"]=function(){if("function"!==typeof this._target)throw new TypeError("Target is not a constructor");var a=Object.create(this._target.prototype);var b=this._target.apply(a,this._values);return q(b)?b:a};l.prototype.array=function(){if(!u(this._target))throw new TypeError("Target is not a array");A.apply(this._target,this._values);return this._target};
    r(n,{isSymbol:{value:function(a){return a instanceof b&&!0===a._isSymbol&&"number"===typeof a._id&&"string"===typeof a._description},writable:!0,configurable:!0},instanceOf:{value:function(a,d){if(!q(d))throw new TypeError("Right-hand side of 'instanceof' is not an object");var c=d[b.hasInstance];if("undefined"===typeof c)return a instanceof d;if("function"!==typeof c)throw new TypeError(typeof c+" is not a function");return c.call(d,a)},writable:!0,configurable:!0},forOf:{value:function(a,d,c){d=
    "function"!==typeof d?B:d;if("function"!==typeof a[b.iterator])throw new TypeError("Iterable[Symbol.iterator] is not a function");a=a[b.iterator]();if("function"!==typeof a.next)throw new TypeError(".iterator.next is not a function");for(;;){var e=a.next();if(!q(e))throw new TypeError("Iterator result "+e+" is not an object");if(e.done)break;d.call(c,e.value)}},writable:!0,configurable:!0},spreadOperator:{value:function(a,b){if("function"!==typeof a&&!u(a))throw new TypeError("Spread operator only supports on array and function objects at this moment");
    return new l(a,b)},writable:!0,configurable:!0}});f(g,"Symbol",{value:b,writable:!0,configurable:!0});f(Function.prototype,b.hasInstance.toString(),{value:function(a){return"function"!==typeof this?!1:a instanceof this}});f(Array.prototype,"concat",{value:function(){if(void 0===this||null===this)throw new TypeError("Array.prototype.concat called on null or undefined");var a=Object(this),d=t.call(arguments),c=[];d.unshift(a);d.forEach(function(a){q(a)?"undefined"!==typeof a[b.isConcatSpreadable]?a[b.isConcatSpreadable]?
    x(c,a):c.push(a):u(a)?x(c,a):c.push(a):c.push(a)});return c},writable:!0,configurable:!0});f(Object.prototype,"toString",{value:function(){return void 0===this||null===this?w.call(this):"string"===typeof this[b.toStringTag]?"[object "+this[b.toStringTag]+"]":w.call(this)},writable:!0,configurable:!0});f(Array.prototype,b.iterator.toString(),{value:function(){if(void 0===this||null===this)throw new TypeError("Cannot convert undefined or null to object");return new k(Object(this),2)},writable:!0,configurable:!0});
    f(Array,"from",{value:function(a,d,c){var e=0;var f="function"===typeof this?this:Array;if(void 0===a||null===a)throw new TypeError("Cannot convert undefined or null to object");a=Object(a);if(void 0===d)d=C;else if("function"!==typeof d)throw new TypeError(d+" is not a function");if("undefined"===typeof a[b.iterator]){if(!("number"===typeof a.length&&0<=a.length)){var h=new f(0);h.length=0;return h}var g=Math.floor(a.length);h=new f(g);for(h.length=g;e<g;++e)h[e]=d.call(c,a[e])}else h=new f,h.length=
    0,n.forOf(a,function(a){h.length++;h[h.length-1]=d.call(c,a)});return h},writable:!0,configurable:!0});f(Array.prototype,"entries",{value:function(){if(void 0===this||null===this)throw new TypeError("Cannot convert undefined or null to object");return new k(Object(this),1)},writable:!0,configurable:!0});f(Array.prototype,"keys",{value:function(){if(void 0===this||null===this)throw new TypeError("Cannot convert undefined or null to object");return new k(Object(this),3)},writable:!0,configurable:!0});
    f(String.prototype,b.iterator.toString(),{value:function(){if(void 0===this||null===this)throw new TypeError("String.prototype[Symbol.iterator] called on null or undefined");return new p(String(this),0)},writable:!0,configurable:!0});return n});

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

const cancellation_tweener = Symbol('cancellationTweener');
const cancellation_cancel = Symbol('cancellationFunction');

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

    static newClipCancellation(value = undefined) {
        let result = {};
        result.value = value;
        result.cancel = () => result[cancellation_cancel]();
        result[cancellation_tweener] = {};
        result[cancellation_cancel] = () => { };

        return result;
    }

    /**
     * @param {{(tweener: PFTweener) : void}} setter
     */
    static To(getter, setter, end, durationMilliseconds) {
        return new PFTween(getter, end, durationMilliseconds).bind(setter);
    }

    /**
     * @param  {...any} clips 
     * @returns {{(result?:any):Promise<{value:any}>}}
     */
    static combine(...clips) {
        clips = clips.flat();
        return result =>
            Promise.all(clips.map(i => i())).then(endValues =>
                Promise.resolve(result != undefined ? result : endValues)
            );
    }

    /**
     * @returns {{(result?:any):Promise<{value:any}>}}
     */
    static concat(...clips) {
        clips = clips.flat();
        return result => {
            return clips.slice(1).reduce((pre, cur) => pre.then(cur), clips[0](result));
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
    onAnimatingVisibleOnly(sceneObject) {
        this.onStartVisible(sceneObject);
        this.onCompleteHidden(sceneObject);
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
        const original = Reactive.pack3(
            sceneObject.transform.x.pinLastValue(),
            sceneObject.transform.y.pinLastValue(),
            sceneObject.transform.z.pinLastValue(),
        );

        privates(this).complete.push(() => sceneObject.transform.position = original);
        return this;
    }

    /**
     * @param {SceneObjectBase} sceneObject
     */
    onCompleteResetRotation(sceneObject) {
        const original = {
            x: sceneObject.transform.rotationX.pinLastValue(),
            y: sceneObject.transform.rotationY.pinLastValue(),
            z: sceneObject.transform.rotationZ.pinLastValue(),
        };

        privates(this).complete.push(() => {
            sceneObject.transform.rotationX = original.x;
            sceneObject.transform.rotationY = original.y;
            sceneObject.transform.rotationZ = original.z;
        });
        return this;
    }

    /**
     * @param {SceneObjectBase} sceneObject
     */
    onCompleteResetScale(sceneObject) {
        const original = Reactive.scale(
            sceneObject.transform.scaleX.pinLastValue(),
            sceneObject.transform.scaleY.pinLastValue(),
            sceneObject.transform.scaleZ.pinLastValue(),
        );

        privates(this).complete.push(() => sceneObject.transform.scale = original);
        return this;
    }

    /**
     * Please note that this can only be used on `SceneObject` containing material property.
     * @param {SceneObjectBase} sceneObject
     */
    onCompleteResetOpacity(sceneObject) {
        const original = sceneObject.material.opacity.pinLastValue();
        privates(this).complete.push(() => sceneObject.material.opacity = original);
        return this;
    }

    apply(autoPlay = true) {
        return animate(privates(this), autoPlay);
    }

    /**
     * @returns {{(value?:any):Promise<{value:any}>}}
     */
    get clip() {
        const completePromise = result => new Promise((resolve, reject) => {
            if (result) {
                if (result[cancellation_cancel]) {
                    result[cancellation_cancel] = () => {
                        result[cancellation_tweener].stop();
                        reject({
                            message: 'canceled',
                            value: result.value,
                            lastValue: result[cancellation_tweener].scalar.pinLastValue(),
                            lastTweener: result[cancellation_tweener]
                        });
                    }

                    result.value = result.value ? result.value : privates(this).sampler.end;
                    privates(this).complete.push(() => resolve(result))
                } else {
                    if (result.value) {
                        privates(this).complete.push(() => resolve(result))
                    } else {
                        privates(this).complete.push(() => resolve({ value: privates(this).sampler.end }))
                    }
                }
            } else {
                privates(this).complete.push(() => resolve({ value: privates(this).sampler.end }))
            }
        });

        if (privates(this).loopCount == Infinity) {
            Diagnostics.log('Please note that set infinite loop will stuck the clips chain.');
        }

        const tweener = this.apply(false);
        return privates(tweener).getPromise(completePromise);
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
        privates(this).getPromise = promise => result => {
            if (result && result[cancellation_tweener]) {
                result[cancellation_tweener] = this;
            }
            this.replay();
            return promise(result);
        }
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