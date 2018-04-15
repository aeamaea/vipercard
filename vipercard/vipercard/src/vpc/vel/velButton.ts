
/* auto */ import { checkThrow, makeVpcScriptErr } from '../../ui512/utils/utilsAssert.js';
/* auto */ import { Util512, getEnumToStrOrUnknown, getStrToEnum } from '../../ui512/utils/utilsUI512.js';
/* auto */ import { TextFontSpec } from '../../ui512/draw/ui512DrawTextClasses.js';
/* auto */ import { UI512BtnStyle } from '../../ui512/elements/ui512ElementsButton.js';
/* auto */ import { VpcElType } from '../../vpc/vpcutils/vpcEnums.js';
/* auto */ import { FormattedSubstringUtil } from '../../vpc/vpcutils/vpcStyleComplex.js';
/* auto */ import { PropGetter, PropSetter, PrpTyp } from '../../vpc/vpcutils/vpcRequestedReference.js';
/* auto */ import { VpcElBase, VpcElSizable } from '../../vpc/vel/velBase.js';

/**
 * a vipercard "button"
 */
export class VpcElButton extends VpcElSizable {
    isVpcElButton = true;
    protected _autohilite = true;
    protected _enabled = true;
    protected _hilite = false;
    protected _checkmark = false;
    protected _icon = 0;
    protected _showlabel = true;
    protected _style: number = VpcBtnStyle.rectangle;
    protected _label = '';
    protected _textalign = 'center';
    protected _textfont = 'chicago';
    protected _textsize = 12;
    protected _textstyle = 0;
    protected _visible = true;
    protected _script = '';
    protected _name = '';
    constructor(id: string, parentId: string) {
        super(id, parentId);
    }

    /* cached getters */
    static cachedGetters: { [key: string]: PropGetter<VpcElBase> };

    /* cached setters */
    static cachedSetters: { [key: string]: PropSetter<VpcElBase> };

    /* the properties that need to be serialized (verified in tests) */
    static readonly keyPropertiesList = [
        'x',
        'y',
        'w',
        'h',
        'autohilite',
        'enabled',
        'hilite',
        'checkmark',
        'icon',
        'showlabel',
        'style',
        'label',
        'textalign',
        'textfont',
        'textsize',
        'textstyle',
        'visible',
        'script',
        'name'
    ];

    /**
     * get the properties that need to be serialized
     */
    getKeyPropertiesList() {
        return VpcElButton.keyPropertiesList;
    }

    /**
     * type of element
     */
    getType() {
        return VpcElType.Btn;
    }

    /**
     * re-use cached getters and setter callback functions for better perf
     */
    startGettersSetters() {
        VpcElButton.btnInit();
        this.getters = VpcElButton.cachedGetters;
        this.setters = VpcElButton.cachedSetters;
    }

    /**
     * from internal textfont to "geneva_12_biuosdce"
     */
    getFontAsUI512() {
        let spec = new TextFontSpec(this._textfont, this._textstyle, this._textsize);
        return spec.toSpecString();
    }

    /**
     * define getters
     */
    static btnGetters(getters: { [key: string]: PropGetter<VpcElBase> }) {
        getters['textalign'] = [PrpTyp.Str, 'textalign'];
        getters['script'] = [PrpTyp.Str, 'script'];
        getters['textstyle'] = [PrpTyp.Str, (me: VpcElButton) => FormattedSubstringUtil.vpcstyleFromInt(me._textstyle)];
        getters['style'] = [
            PrpTyp.Str,
            (me: VpcElButton) => {
                let ret = getEnumToStrOrUnknown<VpcBtnStyle>(VpcBtnStyle, me._style);
                return ret.replace(/osstandard/, 'standard').replace(/osdefault/, 'default');
            }
        ];
    }

    /**
     * define setters
     */
    static btnSetters(setters: { [key: string]: PropSetter<VpcElBase> }) {
        setters['name'] = [PrpTyp.Str, 'name'];
        setters['textstyle'] = [
            PrpTyp.Str,
            (me: VpcElButton, s: string) => {
                let list = s.split(',').map(item => item.trim());
                me.set('textstyle', FormattedSubstringUtil.vpcstyleToInt(list));
            }
        ];

        setters['style'] = [
            PrpTyp.Str,
            (me: VpcElButton, s: string) => {
                let styl = getStrToEnum<VpcBtnStyle>(VpcBtnStyle, 'Button style', s);
                checkThrow(styl !== VpcBtnStyle.osboxmodal, '7D|this style is only supported internally');
                me.set('style', styl);
            }
        ];

        setters['textalign'] = [
            PrpTyp.Str,
            (me: VpcElButton, s: string) => {
                s = s.toLowerCase().trim();
                if (s === 'left') {
                    me.set('textalign', 'left');
                } else if (s === 'center') {
                    me.set('textalign', 'center');
                } else {
                    throw makeVpcScriptErr(`4z|we don't currently support setting text align to ${s}`);
                }
            }
        ];
    }

    static simpleBtnGetSet(): [string, PrpTyp][] {
        return [
            ['autohilite', PrpTyp.Bool],
            ['enabled', PrpTyp.Bool],
            ['hilite', PrpTyp.Bool],
            ['checkmark', PrpTyp.Bool],
            ['icon', PrpTyp.Num],
            ['label', PrpTyp.Str],
            ['showlabel', PrpTyp.Bool],
            ['visible', PrpTyp.Bool],
            ['textfont', PrpTyp.Str],
            ['textsize', PrpTyp.Num]
        ];
    }

    /**
     * define getters and setters
     */
    static btnInit() {
        if (!VpcElButton.cachedGetters || !VpcElButton.cachedSetters) {
            VpcElButton.cachedGetters = {};
            VpcElButton.cachedSetters = {};
            VpcElBase.simpleGetSet(VpcElButton.cachedGetters, VpcElButton.cachedSetters, VpcElButton.simpleBtnGetSet());
            VpcElButton.btnGetters(VpcElButton.cachedGetters);
            VpcElSizable.initSizeGetters(VpcElButton.cachedGetters);
            VpcElButton.btnSetters(VpcElButton.cachedSetters);
            VpcElSizable.initSizeSetters(VpcElButton.cachedSetters);
            Util512.freezeRecurse(VpcElButton.cachedGetters);
            Util512.freezeRecurse(VpcElButton.cachedSetters);
        }
    }
}

/**
 * values here are lowercase, because they are used by the interpreter.
 */
export enum VpcBtnStyle {
    __isUI512Enum = 1,
    transparent = UI512BtnStyle.Transparent,
    rectangle = UI512BtnStyle.Rectangle,
    opaque = UI512BtnStyle.Opaque,
    roundrect = UI512BtnStyle.RoundRect,
    plain = UI512BtnStyle.Plain,
    shadow = UI512BtnStyle.Shadow,
    osstandard = UI512BtnStyle.OSStandard,
    osdefault = UI512BtnStyle.OSDefault,
    osboxmodal = UI512BtnStyle.OSBoxModal,
    checkbox = UI512BtnStyle.Checkbox,
    radio = UI512BtnStyle.Radio,
    alternateforms_standard = UI512BtnStyle.OSStandard,
    alternateforms_default = UI512BtnStyle.OSDefault,
    alternateforms_rect = UI512BtnStyle.Rectangle
}
