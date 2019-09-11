function PFTween(from, to, durationMilliseconds) {
    const Animation = require('Animation');
    const Time = require('Time');
    const Reactive = require('Reactive');
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
        easeInOutBounce: (from, to) => Animation.samplers.easeInOutBounce(from, to)
    };

    let _mirror = false;
    let _loopCount = 1;
    let _samplers = 'easeInOutSine';
    let dirver, sampler, animate, _delayMilliseconds, delayTimer;
    let _onCompletedCallback = [];
    let _onStartCallback = [];
    let _onLoop = [];
    let hasRegistered_onCompleted, hasRegistered_onLoop;

    function Refresh() {
        dirver = Animation.timeDriver({
            durationMilliseconds: durationMilliseconds,
            loopCount: _loopCount,
            mirror: _mirror
        })

        if (typeof from.pinLastValue != undefined && from.pinLastValue) {
            sampler = samplers[_samplers](from.pinLastValue(), to);
        } else {
            sampler = samplers[_samplers](from, to);
        }

        animate = Animation.animate(dirver, sampler);

        if (_onCompletedCallback.length != 0 && !hasRegistered_onCompleted) {
            hasRegistered_onCompleted = true;
            dirver.onCompleted().subscribe(() => _onCompletedCallback.forEach(e => e()));
        }

        if (_delayMilliseconds != undefined) {

            if (delayTimer != undefined)
                Time.clearTimeout(delayTimer);

            delayTimer = Time.setTimeout(() => {
                dirver.start();
                if (_onStartCallback.length != 0) {
                    _onStartCallback.forEach(e => e());
                }
            }, _delayMilliseconds);

            if (_onLoop.length != 0 && !hasRegistered_onLoop) {
                hasRegistered_onLoop = true;
                let _loop = 0;
                Time.setTimeout(() => {
                    const _timer = Time.setInterval(() => {
                        _onLoop.forEach(e => e());
                        _loop++;
                        if (_loop == _loopCount - 1) {
                            Time.clearInterval(_timer);
                        }
                    }, durationMilliseconds);
                }, _delayMilliseconds);
            }
        }
        else {
            dirver.start();

            if (_onLoop.length != 0 && !hasRegistered_onLoop) {
                hasRegistered_onLoop = true;
                let _loop = 0;
                const _timer = Time.setInterval(() => {
                    _onLoop.forEach(e => e());
                    _loop++;
                    if (_loop == _loopCount - 1) {
                        Time.clearInterval(_timer);
                    }
                }, durationMilliseconds);
            }
        }
    }

    this.OnCompleted = callback => {
        _onCompletedCallback.push(callback);
        Refresh();
        return this;
    }

    this.OnStart = callback => {
        _onStartCallback.push(callback);
        return this;
    }

    this.SetMirror = isMrror => {
        _mirror = isMrror == undefined ? true : isMrror;
        Refresh();
        return this;
    }

    this.SetLoop = loopCount => {
        _loopCount = loopCount == undefined ? Infinity : loopCount;
        Refresh();
        return this;
    }

    this.SetEase = ease => {
        _samplers = ease;
        Refresh();
        return this;
    }

    this.OnLoop = callback => {
        _onLoop.push(callback);
        Refresh();
        return this;
    }

    this.SetDelay = delayMilliseconds => {
        _delayMilliseconds = delayMilliseconds;
        Refresh();
        return this;
    }

    this.SetVisibleOnStart = sceneObj => {
        _onStartCallback.push(() => sceneObj.hidden = false);
        Refresh();
        return this;
    }

    this.SetHiddenOnStart = sceneObj => {
        _onStartCallback.push(() => sceneObj.hidden = true);
        Refresh();
        return this;
    }

    this.SetHiddenOnCompleted = sceneObj => {
        _onCompletedCallback.push(() => sceneObj.hidden = true);
        Refresh();
        return this;
    }

    this.SetVisibleOnCompleted = sceneObj => {
        _onCompletedCallback.push(() => sceneObj.hidden = false);
        Refresh();
        return this;
    }

    this.ToSignal = () => {
        return animate;
    }

    this.ToScale = () => {
        return Reactive.scale(animate, animate, animate);
    }

    Refresh();

    return this;
}