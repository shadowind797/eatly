const SELECTOR_ITEM = ".slider__item";
const SELECTOR_ITEMS = ".slider__items";
const SELECTOR_WRAPPER = ".slider__wrapper";
const SELECTOR_PREV = '.slider__control[data-slide="prev"]';
const SELECTOR_NEXT = '.slider__control[data-slide="next"]';
const SELECTOR_INDICATOR = ".slider__indicators>li";

const SLIDER_TRANSITION_OFF = "slider_disable-transition";
const CLASS_CONTROL = "slider__control";
const CLASS_CONTROL_HIDE = "slider__control_hide";
const CLASS_ITEM_ACTIVE = "slider__item_active";
const CLASS_INDICATOR_ACTIVE = "active";

function hasTouchDevice() {
    return !!("ontouchstart" in window || navigator.maxTouchPoints);
}

function hasElementInVew($elem) {
    const rect = $elem.getBoundingClientRect();
    const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
    const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;
    return vertInView && horInView;
}

class Slider {
    _config = {};
    _widthItem = 0;
    _widthWrapper = 0;
    _itemsInVisibleArea = 0;
    _transform = 0;
    _transformStep = 0;
    _intervalId = null;

    _$root = null;
    _$wrapper = null;
    _$items = null;
    _$itemList = null;
    _$controlPrev = null;
    _$controlNext = null;
    _$indicatorList = null;

    _minOrder = 0;
    _maxOrder = 0;

    _$itemByMinOrder = null;
    _$itemByMaxOrder = null;

    _minTranslate = 0;
    _maxTranslate = 0;

    _direction = "next";

    _updateItemPositionFlag = false;
    _activeItems = [];
    _isTouchDevice = hasTouchDevice();

    constructor($elem, config) {
        this._init($elem, config);
        this._addEventListener();
    }

    _init($root, config) {
        this._$root = $root;
        this._$itemList = $root.querySelectorAll(SELECTOR_ITEM);
        this._$items = $root.querySelector(SELECTOR_ITEMS);
        this._$wrapper = $root.querySelector(SELECTOR_WRAPPER);
        this._$controlPrev = $root.querySelector(SELECTOR_PREV);
        this._$controlNext = $root.querySelector(SELECTOR_NEXT);
        this._$indicatorList = $root.querySelectorAll(SELECTOR_INDICATOR);
        const $itemList = this._$itemList;
        const widthItem = parseFloat(getComputedStyle($itemList[0]).width);
        const widthWrapper = parseFloat(getComputedStyle(this._$wrapper).width);
        const itemsInVisibleArea = Math.round(widthWrapper / widthItem);
        this._widthItem = widthItem;
        this._widthWrapper = widthWrapper;
        this._itemsInVisibleArea = itemsInVisibleArea;
        this._transformStep = 100 / itemsInVisibleArea;
        this._config = config;
        $itemList.forEach(($item, position) => {
            $item.dataset.index = position;
            $item.dataset.order = position;
            $item.dataset.translate = 0;
            if (position < itemsInVisibleArea) {
                this._activeItems.push(position);
            }
        });
        this._updateClassForActiveItems();
        if (!this._config.loop) {
            if (this._$controlPrev) {
                this._$controlPrev.classList.add(CLASS_CONTROL_HIDE);
            }
            return;
        }
        const count = $itemList.length - 1;
        const translate = -$itemList.length * 100;
        $itemList[count].dataset.order = -1;
        $itemList[count].dataset.translate = -$itemList.length * 100;
        $itemList[count].style.transform = `translateX(${translate}%)`;
        this._updateExtremeProperties();
        this._updateIndicators();
        this._autoplay();
    }

    _addEventListener() {
        const $root = this._$root;

        $root.addEventListener("click", this._eventHandler.bind(this));

        if (this._config.autoplay && this._config.pauseOnHover) {
            $root.addEventListener("mouseenter", () => {
                this._autoplay("stop");
            });
            $root.addEventListener("mouseleave", () => {
                this._autoplay();
            });
        }

        if (this._config.refresh) {
            window.addEventListener("resize", () => {
                window.requestAnimationFrame(this._refresh.bind(this));
            });
        }

        if (this._config.loop) {
            this._$items.addEventListener("transitionstart", () => {
                this._updateItemPositionFlag = true;
                window.requestAnimationFrame(this._updateItemPosition.bind(this));
            });
            this._$items.addEventListener("transitionend", () => {
                this._updateItemPositionFlag = false;
            });
        }

        if (this._isTouchDevice && this._config.swipe) {
            $root.addEventListener("touchstart", (e) => {
                this._touchStartCoord = e.changedTouches[0].clientX;
            });
            $root.addEventListener("touchend", (e) => {
                const touchEndCoord = e.changedTouches[0].clientX;
                const delta = touchEndCoord - this._touchStartCoord;
                if (delta > 50) {
                    this._moveToPrev();
                } else if (delta < -50) {
                    this._moveToNext();
                }
            });
        }

        if (!this._isTouchDevice && this._config.swipe) {
            $root.addEventListener("mousedown", (e) => {
                this._touchStartCoord = e.clientX;
            });
            $root.addEventListener("mouseup", (e) => {
                const touchEndCoord = e.clientX;
                const delta = touchEndCoord - this._touchStartCoord;
                if (delta > 50) {
                    this._moveToPrev();
                } else if (delta < -50) {
                    this._moveToNext();
                }
            });
        }
    }

    _updateExtremeProperties() {
        const $itemList = this._$itemList;
        this._minOrder = +$itemList[0].dataset.order;
        this._maxOrder = this._minOrder;
        this._$itemByMinOrder = $itemList[0];
        this._$itemByMaxOrder = $itemList[0];
        this._minTranslate = +$itemList[0].dataset.translate;
        this._maxTranslate = this._minTranslate;
        $itemList.forEach(($item) => {
            const order = +$item.dataset.order;
            if (order < this._minOrder) {
                this._minOrder = order;
                this._$itemByMinOrder = $item;
                this._minTranslate = +$item.dataset.translate;
            } else if (order > this._maxOrder) {
                this._maxOrder = order;
                this._$itemByMaxOrder = $item;
                this._minTranslate = +$item.dataset.translate;
            }
        });
    }

    _updateItemPosition() {
        if (!this._updateItemPositionFlag) {
            return;
        }
        const $wrapper = this._$wrapper;
        const $wrapperClientRect = $wrapper.getBoundingClientRect();
        const widthHalfItem =
            $wrapperClientRect.width / this._itemsInVisibleArea / 2;
        const count = this._$itemList.length;
        if (this._direction === "next") {
            const wrapperLeft = $wrapperClientRect.left;
            const $min = this._$itemByMinOrder;
            let translate = this._minTranslate;
            const clientRect = $min.getBoundingClientRect();
            if (clientRect.right < wrapperLeft - widthHalfItem) {
                $min.dataset.order = this._minOrder + count;
                translate += count * 100;
                $min.dataset.translate = translate;
                $min.style.transform = `translateX(${translate}%)`;
                this._updateExtremeProperties();
            }
        } else {
            const wrapperRight = $wrapperClientRect.right;
            const $max = this._$itemByMaxOrder;
            let translate = this._maxTranslate;
            const clientRect = $max.getBoundingClientRect();
            if (clientRect.left > wrapperRight + widthHalfItem) {
                $max.dataset.order = this._maxOrder - count;
                translate -= count * 100;
                $max.dataset.translate = translate;
                $max.style.transform = `translateX(${translate}%)`;
                this._updateExtremeProperties();
            }
        }
        requestAnimationFrame(this._updateItemPosition.bind(this));
    }

    _updateClassForActiveItems() {
        const activeItems = this._activeItems;
        this._$itemList.forEach(($item) => {
            const index = +$item.dataset.index;
            if (activeItems.includes(index)) {
                $item.classList.add(CLASS_ITEM_ACTIVE);
            } else {
                $item.classList.remove(CLASS_ITEM_ACTIVE);
            }
        });
    }

    _updateIndicators() {
        const $indicatorList = this._$indicatorList;
        if (!$indicatorList.length) {
            return;
        }
        this._$itemList.forEach(($item, index) => {
            if ($item.classList.contains(CLASS_ITEM_ACTIVE)) {
                $indicatorList[index].classList.add(CLASS_INDICATOR_ACTIVE);
            } else {
                $indicatorList[index].classList.remove(CLASS_INDICATOR_ACTIVE);
            }
        });
    }

    _move() {
        if (!hasElementInVew(this._$root)) {
            return;
        }

        const step =
            this._direction === "next" ? -this._transformStep : this._transformStep;
        const transform = this._transform + step;

        if (!this._config.loop) {
            const endTransformValue =
                this._transformStep *
                (this._$itemList.length - this._itemsInVisibleArea);
            if (transform < -endTransformValue || transform > 0) {
                return;
            }
            this._$controlPrev.classList.remove(CLASS_CONTROL_HIDE);
            this._$controlNext.classList.remove(CLASS_CONTROL_HIDE);
            if (transform === -endTransformValue) {
                this._$controlNext.classList.add(CLASS_CONTROL_HIDE);
            } else if (transform === 0) {
                this._$controlPrev.classList.add(CLASS_CONTROL_HIDE);
            }
        }

        const activeIndex = [];
        if (this._direction === "next") {
            this._activeItems.forEach((index) => {
                let newIndex = ++index;
                if (newIndex > this._$itemList.length - 1) {
                    newIndex -= this._$itemList.length;
                }
                activeIndex.push(newIndex);
            });
        } else {
            this._activeItems.forEach((index) => {
                let newIndex = --index;
                if (newIndex < 0) {
                    newIndex += this._$itemList.length;
                }
                activeIndex.push(newIndex);
            });
        }
        this._activeItems = activeIndex;
        this._updateClassForActiveItems();
        this._updateIndicators();

        this._transform = transform;
        this._$items.style.transform = `translateX(${transform}%)`;
    }

    _moveToNext() {
        this._direction = "next";
        this._move();
    }

    _moveToPrev() {
        this._direction = "prev";
        this._move();
    }

    _moveTo(index) {
        const $indicatorList = this._$indicatorList;
        let nearestIndex = null;
        let diff = null;
        $indicatorList.forEach(($indicator) => {
            if ($indicator.classList.contains(CLASS_INDICATOR_ACTIVE)) {
                const slideTo = +$indicator.dataset.slideTo;
                if (diff === null) {
                    nearestIndex = slideTo;
                    diff = Math.abs(index - nearestIndex);
                } else {
                    if (Math.abs(index - slideTo) < diff) {
                        nearestIndex = slideTo;
                        diff = Math.abs(index - nearestIndex);
                    }
                }
            }
        });
        diff = index - nearestIndex;
        if (diff === 0) {
            return;
        }
        this._direction = diff > 0 ? "next" : "prev";
        for (let i = 1; i <= Math.abs(diff); i++) {
            this._move();
        }
    }

    _eventHandler(e) {
        const $target = e.target;
        this._autoplay("stop");
        if ($target.classList.contains(CLASS_CONTROL)) {
            e.preventDefault();
            this._direction = $target.dataset.slide;
            this._move();
        } else if ($target.dataset.slideTo) {
            const index = +$target.dataset.slideTo;
            this._moveTo(index);
        }
        this._autoplay();
    }

    _autoplay(action) {
        if (!this._config.autoplay) {
            return;
        }
        if (action === "stop") {
            clearInterval(this._intervalId);
            this._intervalId = null;
            return;
        }
        if (this._intervalId === null) {
            this._intervalId = setInterval(() => {
                this._direction = "next";
                this._move();
            }, this._config.interval);
        }
    }

    _refresh() {
        const $itemList = this._$itemList;
        const widthItem = parseFloat(getComputedStyle($itemList[0]).width);
        const widthWrapper = parseFloat(getComputedStyle(this._$wrapper).width);
        const itemsInVisibleArea = Math.round(widthWrapper / widthItem);

        if (itemsInVisibleArea === this._itemsInVisibleArea) {
            return;
        }

        this._autoplay("stop");

        this._$items.classList.add(SLIDER_TRANSITION_OFF);
        this._$items.style.transform = "translateX(0)";

        this._widthItem = widthItem;
        this._widthWrapper = widthWrapper;
        this._itemsInVisibleArea = itemsInVisibleArea;
        this._transform = 0;
        this._transformStep = 100 / itemsInVisibleArea;
        this._updateItemPositionFlag = false;
        this._activeItems = [];

        $itemList.forEach(($item, position) => {
            $item.dataset.index = position;
            $item.dataset.order = position;
            $item.dataset.translate = 0;
            $item.style.transform = "translateX(0)";
            if (position < itemsInVisibleArea) {
                this._activeItems.push(position);
            }
        });

        this._updateClassForActiveItems();

        window.requestAnimationFrame(() => {
            console.log(this);
            this._$items.classList.remove(SLIDER_TRANSITION_OFF);
        });

        if (!this._config.loop) {
            if (this._$controlPrev) {
                this._$controlPrev.classList.add(CLASS_CONTROL_HIDE);
            }
            return;
        }

        const count = $itemList.length - 1;
        const translate = -$itemList.length * 100;
        $itemList[count].dataset.order = -1;
        $itemList[count].dataset.translate = -$itemList.length * 100;
        $itemList[count].style.transform = `translateX(${translate}%)`;
        this._updateExtremeProperties();
        this._updateIndicators();
        this._autoplay();
    }

    next() {
        this._moveToNext();
    }
    prev() {
        this._moveToPrev();
    }
    moveTo(index) {
        this._moveTo(index);
    }
    refresh() {
        this._refresh();
    }
}

export default Slider;
