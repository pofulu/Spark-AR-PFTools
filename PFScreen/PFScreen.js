function PFScreen(baseWidth, baseHeight) {
    const CameraInfo = require('CameraInfo');
    let _adaptor;
    let _callback;
    CameraInfo.previewSize.width
        .monitor({ 'fireOnInitialValue': true })
        .subscribeWithSnapshot({
            'width': CameraInfo.previewSize.width,
            'height': CameraInfo.previewSize.height
        }, (v, snapshot) => {
            _adaptor = new Adaptor(baseWidth, baseHeight, snapshot.width, snapshot.height);
            this.adaptor = _adaptor;
            if(_callback != undefined)
                _callback(_adaptor);
        });

    this.subscribe = (callback) => _callback = callback;
    this.adaptor = undefined;
    return this;

    function Adaptor(baseWidth, baseHeight, realWidth, realHeight) {
        const baseRatio = baseHeight / baseWidth;
        const realRatio = realHeight / realWidth;
        const sizeMultiplier = baseRatio / realRatio;

        this.width = realWidth;
        this.height = realHeight;
        this.sizeMultiplier = sizeMultiplier;

        this.GetSize = function (scale) {
            return sizeMultiplier * scale;
        }

        this.GetX = function (percentageX) {
            const widthMax = realWidth / realHeight * 25;
            return percentageX * (2 * widthMax) - widthMax;
        }

        this.GetY = function (percentageY) {
            return percentageY * -50 + 25;
        }

        this.GetPercX = function (transformX) {
            const widthMax = realWidth / realHeight * 25;
            return (transformX + widthMax) / (widthMax * 2);
        }

        this.GetPercY = function (transformY) {
            return (25 - transformY) / 50;
        }
    }
}
