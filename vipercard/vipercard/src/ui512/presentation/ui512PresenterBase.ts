
/* auto */ import { O, respondUI512Error } from '../../ui512/utils/utilsAssert.js';
/* auto */ import { RenderComplete, RepeatingTimer, UI512IsPresenterInterface, Util512, fitIntoInclusive } from '../../ui512/utils/utils512.js';
/* auto */ import { CanvasWrapper } from '../../ui512/utils/utilsDraw.js';
/* auto */ import { NullaryFn } from '../../ui512/utils/utilsTestCanvas.js';
/* auto */ import { ChangeContext, ClipManagerInterface, MenuOpenState, UI512EventType, UI512PresenterInterface } from '../../ui512/draw/ui512Interfaces.js';
/* auto */ import { UI512Element } from '../../ui512/elements/ui512Element.js';
/* auto */ import { UI512Application } from '../../ui512/elements/ui512ElementApp.js';
/* auto */ import { UI512ElTextField } from '../../ui512/elements/ui512ElementTextField.js';
/* auto */ import { UI512ViewDraw } from '../../ui512/elements/ui512ElementView.js';
/* auto */ import { EventDetails, FocusChangedEventDetails, MouseEnterDetails, MouseLeaveDetails, MouseMoveEventDetails } from '../../ui512/menu/ui512Events.js';
/* auto */ import { UI512PresenterWithMenuInterface } from '../../ui512/menu/ui512PresenterWithMenu.js';
/* auto */ import { TemporarilySuspendEvents } from '../../ui512/menu/ui512SuspendEvents.js';

/**
 * a Presenter receives Events,
 * updates Models accordingly,
 * and sends Models to ElementsView to be drawn.
 *
 * UI512PresenterBase can draw a UI not including indirectly constructed elements (scrollbars and menus).
 * for those, use the full _UI512Presenter_ class.
 */
export abstract class UI512PresenterBase implements UI512PresenterWithMenuInterface, UI512IsPresenterInterface {
    readonly defaultPriority = 10;
    readonly maxMouseButtons = 5;
    private currentFocus: O<string>;
    app: UI512Application;
    trackMouse = [-1, -1];
    trackPressedBtns: boolean[] = Util512.repeat(this.maxMouseButtons, false);
    trackClickedIds: O<string>[] = Util512.repeat(this.maxMouseButtons, undefined);
    listeners: { [t: number]: Function[] } = {};
    callbackQueueFromAsyncs: (O<NullaryFn>)[] = [];
    needRedraw = true;
    inited = false;
    openState = MenuOpenState.MenusClosed;
    view = new UI512ViewDraw();
    tmpSuspend: O<TemporarilySuspendEvents>;
    mouseDragStatus: number;
    useOSClipboard: boolean;
    clipManager: ClipManagerInterface;
    timerSlowIdle: RepeatingTimer;

    /**
     * copy over mouse-tracking state from another presenter.
     */
    importMouseTracking(other: UI512PresenterWithMenuInterface) {
        /* note, we don't need to copy over trackClickedIds,
        since having a click+drag persist across loading a screen would be weird. */
        if (other.trackMouse !== undefined) {
            this.trackMouse = other.trackMouse;
            this.trackPressedBtns = other.trackPressedBtns;
        }
    }

    /**
     * which element is focused
     */
    getCurrentFocus() {
        return this.currentFocus;
    }

    /**
     * set element with the focus
     */
    setCurrentFocus(next: O<string>, skipCloseFieldMsg=false) {
        if (next !== this.currentFocus) {
            let evt = new FocusChangedEventDetails(this.currentFocus, next);
            evt.skipCloseFieldMsg = skipCloseFieldMsg

            try {
                this.rawEvent(evt);
            } catch (e) {
                respondUI512Error(e, 'FocusChangedEvent response');
            }

            if (!evt.preventChange) {
                this.currentFocus = next;
            }

            /* adjust focus to be appropriate to length of content */
            let nextFocus = this.app.findEl(next);
            if (nextFocus && nextFocus instanceof UI512ElTextField) {
                let txt = nextFocus.getFmTxt();
                nextFocus.set('selcaret', fitIntoInclusive(nextFocus.getN('selcaret'), 0, txt.len()));
                nextFocus.set('selend', fitIntoInclusive(nextFocus.getN('selend'), 0, txt.len()));
            }
        }
    }

    /**
     * register to listen for an event
     */
    listenEvent(type: UI512EventType, fn: (pr: UI512PresenterInterface, d: EventDetails) => void) {
        let ar = this.listeners[type.valueOf()];
        if (ar !== undefined) {
            ar.push(fn);
        } else {
            this.listeners[type.valueOf()] = [fn];
        }
    }

    /**
     * handle an incoming event, and dispatch it to all of the listeners
     */
    rawEvent(d: EventDetails) {
        let evtNumber = d.type().valueOf();
        let ar = this.listeners[evtNumber];
        try {
            if (ar) {
                /* use a plain JS loop and not a for/of loop here, this area
                benefits from perf micro-optimizations */
                for (let i = 0, len = ar.length; i < len; i++) {
                    if (d.handled()) {
                        break;
                    }

                    let cb = ar[i];
                    cb(this, d);
                }
            }
        } catch (e) {
            respondUI512Error(e, 'event ' + d.type());
            return;
        }

        /* construct mouseleave and mouseenter events */
        if (d instanceof MouseMoveEventDetails) {
            if (d.elNext !== d.elPrev) {
                if (d.elPrev) {
                    this.rawEvent(new MouseLeaveDetails(d.elPrev));
                }

                if (d.elNext && this.canInteract(d.elNext)) {
                    this.rawEvent(new MouseEnterDetails(d.elNext));
                }
            }
        }
    }

    /**
     * can the element be interacted with
     */
    canInteract(el: O<UI512Element>) {
        if (el) {
            return el.enabled && el.visible;
        } else {
            return false;
        }
    }

    /**
     * return true if text can be selected in this field
     */
    canSelectTextInField(el: UI512ElTextField): boolean {
        /* subclasses can provide other logic here */
        return true;
    }

    /**
     * implementation of the change Observer. cause redraw if an element has changed.
     */
    changeSeen(context: ChangeContext): void {
        this.needRedraw = true;
    }

    /**
     * cause redraw if an element has changed.
     */
    invalidateAll() {
        this.needRedraw = true;
    }

    /**
     * render - if an element has changed, draw all elements onto the canvas!
     */
    render(canvas: CanvasWrapper, ms: number, cmpTotal: RenderComplete): void {
        if (!this.inited) {
            cmpTotal.complete = false;
            return;
        }

        if (this.needRedraw) {
            this.setPositionsForRender(cmpTotal);
        }

        this.view.renderApp(canvas, cmpTotal, this.app, this.currentFocus, this.needRedraw);
        if (cmpTotal.complete) {
            this.needRedraw = false;
        }

        if (this.tmpSuspend) {
            this.tmpSuspend.pulse(this, ms);
        }
    }

    /**
     * this is a way to run code asynchronously, while still having UI512 in the callback, to get error-handling.
     */
    placeCallbackInQueue(cb: () => void) {
        this.callbackQueueFromAsyncs.push(cb);
    }

    /**
     * queueRefreshCursor, not needed here but a subclass can implement it
     */
    queueRefreshCursor(): void {}

    abstract removeEl(gpid: string, elId: string, context: ChangeContext): void;
    protected abstract setPositionsForRender(cmpTotal: RenderComplete): void;
    abstract rebuildFieldScrollbars(): void;
}
