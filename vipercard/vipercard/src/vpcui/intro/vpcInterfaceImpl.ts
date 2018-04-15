
/* auto */ import { O, checkThrow } from '../../ui512/utils/utilsAssert.js';
/* auto */ import { UI512PaintDispatch } from '../../ui512/draw/ui512DrawPaintDispatch.js';
/* auto */ import { ElementObserverVal } from '../../ui512/elements/ui512ElementsGettable.js';
/* auto */ import { EventDetails } from '../../ui512/menu/ui512Events.js';
/* auto */ import { UI512CompBase } from '../../ui512/composites/ui512Composites.js';
/* auto */ import { OrdinalOrPosition, VpcElType, VpcTool } from '../../vpc/vpcutils/vpcEnums.js';
/* auto */ import { VpcElBase } from '../../vpc/vel/velBase.js';
/* auto */ import { VpcModelTop } from '../../vpc/vel/velModelTop.js';
/* auto */ import { OutsideWorldReadWrite } from '../../vpc/vel/velOutsideInterfaces.js';
/* auto */ import { CodeExecFrame } from '../../vpc/codeexec/vpcScriptExecFrame.js';
/* auto */ import { CodeExecFrameStack } from '../../vpc/codeexec/vpcScriptExecFrameStack.js';
/* auto */ import { CodeExecTop } from '../../vpc/codeexec/vpcScriptExecTop.js';
/* auto */ import { TypeOfUndoAction, VpcStateInterface } from '../../vpcui/state/vpcInterface.js';
/* auto */ import { VpcApplication } from '../../vpcui/state/vpcState.js';
/* auto */ import { VpcPresenterEvents } from '../../vpcui/presentation/vpcPresenterEvents.js';
/* auto */ import { VpcPresenter } from '../../vpcui/presentation/vpcPresenter.js';

export class VpcStateInterfaceCompleted implements VpcStateInterface {
    protected appl: VpcApplication;
    protected ctrller: VpcPresenter;
    init(appl: VpcApplication, ctrller: VpcPresenter) {
        this.appl = appl;
        this.ctrller = ctrller;
    }

    getOption_s(prop: string) {
        if (this.appl.runtime.opts.isARuntimeOpt[prop]) {
            return this.appl.runtime.opts.getS(prop);
        } else {
            return this.appl.model.productOpts.getS(prop);
        }
    }
    getOption_n(prop: string) {
        if (this.appl.runtime.opts.isARuntimeOpt[prop]) {
            return this.appl.runtime.opts.getN(prop);
        } else {
            return this.appl.model.productOpts.getN(prop);
        }
    }

    getOption_b(prop: string) {
        if (this.appl.runtime.opts.isARuntimeOpt[prop]) {
            return this.appl.runtime.opts.getB(prop);
        } else {
            return this.appl.model.productOpts.getB(prop);
        }
    }

    setOption<T extends ElementObserverVal>(prop: string, newval: T) {
        if (this.appl.runtime.opts.isARuntimeOpt[prop]) {
            return this.appl.runtime.opts.set(prop, newval);
        } else {
            return this.appl.model.productOpts.set(prop, newval);
        }
    }

    performUndo(): boolean {
        return this.appl.undoManager.performUndo(this);
    }

    performRedo(): boolean {
        return this.appl.undoManager.performRedo(this);
    }

    getCurrentStateId(): string {
        return this.appl && this.appl.undoManager && this.appl.undoManager.getCurrentStateId();
    }

    findExecFrameStack(): [O<CodeExecFrameStack>, O<CodeExecFrame>] {
        let frstack = this.appl.runtime.codeExec.workQueue[0];
        if (frstack) {
            return [frstack, frstack.stack[frstack.stack.length - 1]];
        } else {
            return [undefined, undefined];
        }
    }

    getModel(): VpcModelTop {
        return this.appl.model;
    }
    isCodeRunning(): boolean {
        return this.appl.runtime.codeExec.isCodeRunning();
    }

    rawRevive(readded: VpcElBase) {
        checkThrow(
            !this.getCodeExec().isCodeRunning(),
            "8#|currently can't add or remove an element while code is running"
        );
        this.causeFullRedraw();
        readded.observer = this.appl.runtime.useThisObserverForVpcEls;
        this.getModel().addIdToMapOfElements(readded);
        this.getCodeExec().updateChangedCode(readded, readded.getS('script'));
    }

    rawCreate<T extends VpcElBase>(velId: string, parentId: string, ctr: { new (...args: any[]): T }): T {
        this.causeFullRedraw();
        let vel = new ctr(velId, parentId);
        checkThrow(vel && vel.isVpcElBase, `8*|must be a VpcElBase`);
        vel.observer = this.appl.runtime.useThisObserverForVpcEls;
        this.appl.model.addIdToMapOfElements(vel);
        return vel;
    }

    createElem(parent_id: string, type: VpcElType, insertIndex: number, specifyId?: string): VpcElBase {
        return this.appl.createElem(parent_id, type, insertIndex, specifyId);
    }

    removeElem(vel: VpcElBase) {
        this.appl.removeElem(vel);
    }

    doWithoutAbilityToUndo(fn: () => void) {
        this.appl.undoManager.doWithoutAbilityToUndo(fn);
    }

    doWithoutAbilityToUndoExpectingNoChanges(fn: () => void) {
        this.appl.undoManager.doWithoutAbilityToUndoExpectingNoChanges(fn);
    }

    undoableAction(fn: () => void, typ?: TypeOfUndoAction) {
        this.appl.undoManager.undoableAction(fn, typ || TypeOfUndoAction.StartNewAction);
    }

    scheduleScriptEventSend(d: EventDetails) {
        return VpcPresenterEvents.scheduleScriptMsg(this.ctrller, this, d);
    }

    UI512App() {
        return this.ctrller.app;
    }

    getPresenter() {
        return this.ctrller;
    }

    placeCallbackInQueue(cb: () => void) {
        return this.ctrller.placeCallbackInQueue(cb);
    }
    bounds() {
        return this.ctrller.bounds;
    }
    userBounds() {
        return this.ctrller.userBounds;
    }
    getCurrentCardNum() {
        return this.ctrller.getCurrentCardNum();
    }
    setCurrentCardNum(pos: OrdinalOrPosition) {
        return this.ctrller.setCurrentCardNum(pos);
    }
    getTool() {
        return this.ctrller.getTool();
    }
    setTool(n: VpcTool) {
        return this.ctrller.setTool(n);
    }
    setNonModalDialog(frm: O<UI512CompBase>) {
        return this.ctrller.lyrNonModalDlgHolder.setNonModalDialog(frm);
    }
    getCurrentFocusVelField() {
        return this.ctrller.getSelectedFieldVel();
    }
    setCurrentFocus(s: O<string>) {
        return this.ctrller.setCurrentFocus(s);
    }
    getCurrentFocus() {
        return this.ctrller.getCurrentFocus();
    }
    performMenuAction(s: string) {
        return this.ctrller.performMenuAction(s);
    }
    commitSimulatedClicks(queue: UI512PaintDispatch[]) {
        return this.ctrller.lyrPaintRender.commitSimulatedClicks(queue);
    }
    causeUIRedraw() {
        return this.ctrller.lyrModelRender.uiRedrawNeeded();
    }
    causeFullRedraw() {
        return this.ctrller.lyrModelRender.fullRedrawNeeded();
    }

    getOutside(): OutsideWorldReadWrite {
        return this.appl.runtime.outside;
    }

    getCodeExec(): CodeExecTop {
        return this.appl.runtime.codeExec;
    }

    destroy(): void {
        this.appl.appli = undefined as any; /* destroy() */
        this.appl.model.destroy();
        this.appl.model = undefined as any; /* destroy() */
        this.appl.runtime.destroy();
        this.appl.runtime = undefined as any; /* destroy() */
        this.appl.undoManager = undefined as any; /* destroy() */
        this.appl = undefined as any; /* destroy() */
        this.ctrller = undefined as any; /* destroy() */
    }
}
