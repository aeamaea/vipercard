
/* auto */ import { assertEq } from '../../ui512/utils/utils512.js';
/* auto */ import { UI512TestBase } from '../../ui512/utils/utilsTest.js';
/* auto */ import { FormattedText } from '../../ui512/draw/ui512FormattedText.js';
/* auto */ import { RememberHistory } from '../../vpc/vpcutils/vpcUtils.js';
/* auto */ import { VpcNonModalReplBox } from '../../vpcui/nonmodaldialogs/vpcReplMessageBox.js';

/**
 * tests on FormattedText
 */
let mTests: (string | Function)[] = [
    'VpcNonModalReplBox.makeAllVarsGlobals with no input',
    () => {
        let s = '';
        let got: string[] = [];
        VpcNonModalReplBox.makeAllVarsGlobals(got, s);
        assertEq([], got, 'Gi|');
    },
    'VpcNonModalReplBox.makeAllVarsGlobals with typical input',
    () => {
        let s = 'put 4 into myVar';
        let got: string[] = [];
        VpcNonModalReplBox.makeAllVarsGlobals(got, s);
        assertEq(['global myVar'], got, 'Gh|');
    },
    'VpcNonModalReplBox.makeAllVarsGlobals with typical input with underscore',
    () => {
        let s = 'put 4 into my_var';
        let got: string[] = [];
        VpcNonModalReplBox.makeAllVarsGlobals(got, s);
        assertEq(['global my_var'], got, 'Gg|');
    },
    'VpcNonModalReplBox.makeAllVarsGlobals with typical input with leading underscore',
    () => {
        let s = 'put 4 into _my_var';
        let got: string[] = [];
        VpcNonModalReplBox.makeAllVarsGlobals(got, s);
        assertEq(['global _my_var'], got, 'Gf|');
    },
    'VpcNonModalReplBox.makeAllVarsGlobals with customHandler',
    () => {
        let s = 'myCustomFn 4, myVar';
        let got: string[] = [];
        VpcNonModalReplBox.makeAllVarsGlobals(got, s);
        assertEq(['global myVar'], got, 'Ge|');
    },
    'VpcNonModalReplBox.makeAllVarsGlobals with no symbols',
    () => {
        let s = 'exit repeat';
        let got: string[] = [];
        VpcNonModalReplBox.makeAllVarsGlobals(got, s);
        assertEq([], got, 'Gd|');
    },
    'VpcNonModalReplBox.makeAllVarsGlobals with only numbers and strings',
    () => {
        let s = 'return 123 & "notvars x y z"';
        let got: string[] = [];
        s = VpcNonModalReplBox.removeStringLiterals(s);
        VpcNonModalReplBox.makeAllVarsGlobals(got, s);
        assertEq([], got, 'Gc|');
    },
    'VpcNonModalReplBox.makeAllVarsGlobals with only reserved keywords',
    () => {
        let s = 'put result + card background sin italic autohilite into on mouseUp';
        let got: string[] = [];
        VpcNonModalReplBox.makeAllVarsGlobals(got, s);
        assertEq([], got, 'Gb|');
    },
    'VpcNonModalReplBox.makeAllVarsGlobals should skip fn calls',
    () => {
        let s = 'put 4 + myFunction() into myVar';
        let got: string[] = [];
        VpcNonModalReplBox.makeAllVarsGlobals(got, s);
        assertEq(['global myVar'], got, 'Ga|');
    },
    'VpcNonModalReplBox.makeAllVarsGlobals should skip fn calls at end',
    () => {
        let s = 'put 4 + myFunction(x) into myFunction()';
        let got: string[] = [];
        VpcNonModalReplBox.makeAllVarsGlobals(got, s);
        assertEq(['global x'], got, 'GZ|');
    },
    'VpcNonModalReplBox.makeAllVarsGlobals should skip fn calls with args',
    () => {
        let s = 'put 4 + myFunction(1,2) into myVar';
        let got: string[] = [];
        VpcNonModalReplBox.makeAllVarsGlobals(got, s);
        assertEq(['global myVar'], got, 'GY|');
    },
    'VpcNonModalReplBox.makeAllVarsGlobals with input referencing many',
    () => {
        let s = 'aCustomHandler x + (y * var1/var2)+x+y into myVar';
        let got: string[] = [];
        VpcNonModalReplBox.makeAllVarsGlobals(got, s);
        assertEq(
            ['global x', 'global y', 'global var1', 'global var2', 'global x', 'global y', 'global myVar'],
            got,
            'GX|'
        );
    },
    'VpcNonModalReplBox.RememberHistory walk previous with no history',
    () => {
        let h = new RememberHistory();
        assertEq('', h.walkPrevious(), 'GW|');
        assertEq('', h.walkPrevious(), 'GV|');
        assertEq('', h.walkPrevious(), 'GU|');
    },
    'VpcNonModalReplBox.RememberHistory walk next with no history',
    () => {
        let h = new RememberHistory();
        assertEq('', h.walkNext(), 'GT|');
        assertEq('', h.walkNext(), 'GS|');
        assertEq('', h.walkNext(), 'GR|');
    },
    'VpcNonModalReplBox.RememberHistory walk through history',
    () => {
        let h = new RememberHistory();
        h.append('aa');
        h.append('bb');
        h.append('cc');
        h.append('dd');
        assertEq('', h.walkNext(), 'GQ|');
        assertEq('', h.walkNext(), 'GP|');
        assertEq('', h.walkNext(), 'GO|');
        assertEq('dd', h.walkPrevious(), 'GN|');
        assertEq('cc', h.walkPrevious(), 'GM|');
        assertEq('bb', h.walkPrevious(), 'GL|');
        assertEq('aa', h.walkPrevious(), 'GK|');
        assertEq('aa', h.walkPrevious(), 'GJ|');
        assertEq('aa', h.walkPrevious(), 'GI|');
        assertEq('bb', h.walkNext(), 'GH|');
        assertEq('cc', h.walkNext(), 'GG|');
        assertEq('dd', h.walkNext(), 'GF|');
        assertEq('', h.walkNext(), 'GE|');
        assertEq('', h.walkNext(), 'GD|');
    },
    'VpcNonModalReplBox.RememberHistory add during going back',
    () => {
        let h = new RememberHistory();
        h.append('aa');
        h.append('bb');
        h.append('cc');
        assertEq('cc', h.walkPrevious(), 'GC|');
        assertEq('bb', h.walkPrevious(), 'GB|');
        h.append('dd');
        assertEq('dd', h.walkPrevious(), 'GA|');
        assertEq('cc', h.walkPrevious(), 'G9|');
    }
];

/**
 * exported test class for mTests
 */
export class TestVpcMsgBox extends UI512TestBase {
    tests = mTests;
}
