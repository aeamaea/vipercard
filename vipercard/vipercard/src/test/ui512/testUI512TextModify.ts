
/* auto */ import { assertEq } from '../../ui512/utils/utils512.js';
/* auto */ import { UI512TestBase } from '../../ui512/utils/utilsTest.js';
/* auto */ import { TextFontStyling, specialCharFontChange, textFontStylingToString } from '../../ui512/draw/ui512DrawTextClasses.js';
/* auto */ import { TextSelModifyImpl } from '../../ui512/textedit/ui512TextSelModifyImpl.js';
/* auto */ import { TestUI512TextSelectEvents } from '../../test/ui512/testUI512TextSelectEvents.js';

/**
 * tests on TextSelModifyImpl that modify the text
 *
 * To make the tests easier to read, we use the symbol
 * ^ to mean the selcaret (start of selection)
 * # to mean the selend (end of selection)
 * and
 * | to mean a newline character
 *
 *
 * For example, to say that the second word should be selected, we can write
 * "abc ^def# ghi"
 */
let mTests: (string | Function)[] = [
    'testchangeTextDuplicate',
    () => {
        testChangeText('^#', '^#', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('^#a|a', '^#a', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('a^#|a', 'a^#', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('abcd^#|abcd', 'abcd^#', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('a^#bcd|abcd', 'a^#bcd', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('^#abcd|abcd', '^#abcd', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('a^#bcd|abcd', 'a^bc#d', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('12|abcd^#|abcd', '12|abcd^#', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('12|a^#bcd|abcd', '12|a^#bcd', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('12|^#abcd|abcd', '12|^#abcd', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('12|a^#bcd|abcd', '12|a^bc#d', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('12|abcd^#|abcd|34', '12|abcd^#|34', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('12|a^#bcd|abcd|34', '12|a^#bcd|34', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('12|^#abcd|abcd|34', '12|^#abcd|34', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('12|a^#bcd|abcd|34', '12|a^bc#d|34', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('abcd^#|abcd|34', 'abcd^#|34', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('a^#bcd|abcd|34', 'a^#bcd|34', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('^#abcd|abcd|34', '^#abcd|34', TextSelModifyImpl.changeTextDuplicate);
        testChangeText('a^#bcd|abcd|34', 'a^bc#d|34', TextSelModifyImpl.changeTextDuplicate);
    },
    'testchangeTextIndentation.Decrease,OneLine',
    () => {
        testChangeText('^#', '^#', TextSelModifyImpl.changeTextIndentation, true, defFont);
        testChangeText('^abc#', 'abc^#', TextSelModifyImpl.changeTextIndentation, true, defFont);
        testChangeText('^a\tbc#', 'a\tbc^#', TextSelModifyImpl.changeTextIndentation, true, defFont);
        testChangeText('^abc#', '\ta^b#c', TextSelModifyImpl.changeTextIndentation, true, defFont);
        testChangeText('^abc#', '\tabc^#', TextSelModifyImpl.changeTextIndentation, true, defFont);
        testChangeText('^\tabc#', '\t\tabc^#', TextSelModifyImpl.changeTextIndentation, true, defFont);
        testChangeText('^\t\tabc#', '\t\t\tabc^#', TextSelModifyImpl.changeTextIndentation, true, defFont);
        testChangeText('^abc\tdef#', '\tabc\tdef^#', TextSelModifyImpl.changeTextIndentation, true, defFont);
        testChangeText('^abc#', '    abc^#', TextSelModifyImpl.changeTextIndentation, true, defFont);
        testChangeText('^\tabc#', '        abc^#', TextSelModifyImpl.changeTextIndentation, true, defFont);
        testChangeText('^\tabc#', '    \tabc^#', TextSelModifyImpl.changeTextIndentation, true, defFont);
    },
    'testchangeTextIndentation.Increase,OneLine',
    () => {
        testChangeText('^#', '^#', TextSelModifyImpl.changeTextIndentation, false, defFont);
        testChangeText('^\tabc#', 'abc^#', TextSelModifyImpl.changeTextIndentation, false, defFont);
        testChangeText('^\ta\tbc#', 'a\tbc^#', TextSelModifyImpl.changeTextIndentation, false, defFont);
        testChangeText('^\t\tabc#', '\ta^b#c', TextSelModifyImpl.changeTextIndentation, false, defFont);
        testChangeText('^\t\tabc#', '\tabc^#', TextSelModifyImpl.changeTextIndentation, false, defFont);
        testChangeText('^\t\t\tabc#', '\t\tabc^#', TextSelModifyImpl.changeTextIndentation, false, defFont);
        testChangeText('^\t\t\t\tabc#', '\t\t\tabc^#', TextSelModifyImpl.changeTextIndentation, false, defFont);
        testChangeText('^\t\ta\tdef#', '\ta\tdef^#', TextSelModifyImpl.changeTextIndentation, false, defFont);
        testChangeText('^\t\tabc#', '    abc^#', TextSelModifyImpl.changeTextIndentation, false, defFont);
        testChangeText('^\t\t\tabc#', '        abc^#', TextSelModifyImpl.changeTextIndentation, false, defFont);
        testChangeText('^\t\t\tabc#', '    \tabc^#', TextSelModifyImpl.changeTextIndentation, false, defFont);
    },
    'testchangeTextIndentation.Decrease,ManyLines',
    () => {
        testChangeText(
            '^\tabc|ABC|def#|\tDEF',
            '^\t\tabc|\tABC|def#|\tDEF',
            TextSelModifyImpl.changeTextIndentation,
            true,
            defFont
        );
        testChangeText(
            '^\tabc|ABC|def#|\tDEF',
            '\t\tab^c|\tABC|d#ef|\tDEF',
            TextSelModifyImpl.changeTextIndentation,
            true,
            defFont
        );
        testChangeText(
            '\t\tabc|^ABC|def#|\tDEF',
            '\t\tabc|^\tABC|def#|\tDEF',
            TextSelModifyImpl.changeTextIndentation,
            true,
            defFont
        );
        testChangeText(
            '\t\tabc|^ABC|def#|\tDEF',
            '\t\tabc|\tABC^|#def|\tDEF',
            TextSelModifyImpl.changeTextIndentation,
            true,
            defFont
        );
    },
    'testchangeTextIndentation.Increase,ManyLines',
    () => {
        testChangeText(
            '^\t\t\tabc|\t\tABC|\tdef#|\tDEF',
            '^\t\tabc|\tABC|def#|\tDEF',
            TextSelModifyImpl.changeTextIndentation,
            false,
            defFont
        );
        testChangeText(
            '^\t\t\tabc|\t\tABC|\tdef#|\tDEF',
            '\t\tab^c|\tABC|d#ef|\tDEF',
            TextSelModifyImpl.changeTextIndentation,
            false,
            defFont
        );
        testChangeText(
            '\t\tabc|^\t\tABC|\tdef#|\tDEF',
            '\t\tabc|^\tABC|def#|\tDEF',
            TextSelModifyImpl.changeTextIndentation,
            false,
            defFont
        );
        testChangeText(
            '\t\tabc|^\t\tABC|\tdef#|\tDEF',
            '\t\tabc|\tABC^|#def|\tDEF',
            TextSelModifyImpl.changeTextIndentation,
            false,
            defFont
        );
    },
    'testchangeTextToggleLinePrefix.AddPrefixOnOneLine',
    () => {
        testChangeText('^#', '^#', TextSelModifyImpl.changeTextToggleLinePrefix, 'PRE', defFont);
        testChangeText('^PREabc#', 'abc^#', TextSelModifyImpl.changeTextToggleLinePrefix, 'PRE', defFont);
        testChangeText('^PREabc#', '^#abc', TextSelModifyImpl.changeTextToggleLinePrefix, 'PRE', defFont);
        testChangeText('^PREPRabc#', 'PRabc^#', TextSelModifyImpl.changeTextToggleLinePrefix, 'PRE', defFont);
        testChangeText('^PREaPREbc#', '^#aPREbc', TextSelModifyImpl.changeTextToggleLinePrefix, 'PRE', defFont);
        testChangeText('^\tPREaPREbc#', '^#\taPREbc', TextSelModifyImpl.changeTextToggleLinePrefix, 'PRE', defFont);
    },
    'testchangeTextToggleLinePrefix.RemovePrefixOnOneLine',
    () => {
        testChangeText('^abc#', 'PREabc^#', TextSelModifyImpl.changeTextToggleLinePrefix, 'PRE', defFont);
        testChangeText('^abc#', '^#PREabc', TextSelModifyImpl.changeTextToggleLinePrefix, 'PRE', defFont);
        testChangeText('^PRabc#', 'PREPRabc^#', TextSelModifyImpl.changeTextToggleLinePrefix, 'PRE', defFont);
        testChangeText('^aPREbc#', '^#PREaPREbc', TextSelModifyImpl.changeTextToggleLinePrefix, 'PRE', defFont);
        testChangeText('^PREabc#', '^#PREPREabc', TextSelModifyImpl.changeTextToggleLinePrefix, 'PRE', defFont);
        testChangeText('^\tPREabc#', '^#\tPREPREabc', TextSelModifyImpl.changeTextToggleLinePrefix, 'PRE', defFont);
    },
    'testchangeTextToggleLinePrefix.AddPrefixOnManyLines',
    () => {
        let c = specialCharFontChange;
        testChangeText('^PREab|PREcd#|ef', '^ab|cd#|ef', TextSelModifyImpl.changeTextToggleLinePrefix, 'PRE', defFont);
        testChangeText('^PREab|PREcd#|ef', 'ab^|#cd|ef', TextSelModifyImpl.changeTextToggleLinePrefix, 'PRE', defFont);
        testChangeText(
            `ab|^PREcd|${c}${defFont}${c}PRE#`,
            'ab|cd#|^',
            TextSelModifyImpl.changeTextToggleLinePrefix,
            'PRE',
            defFont
        );
        testChangeText(
            `ab|cd|${c}${defFont}${c}^PRE#`,
            'ab|cd|^#',
            TextSelModifyImpl.changeTextToggleLinePrefix,
            'PRE',
            defFont
        );
    },
    'testchangeTextToggleLinePrefix.RemovePrefixOnManyLines',
    () => {
        let c = specialCharFontChange;
        testChangeText(
            '^ab|cd#|PREef',
            '^PREab|PREcd#|PREef',
            TextSelModifyImpl.changeTextToggleLinePrefix,
            'PRE',
            defFont
        );
        testChangeText(
            '^ab|cd#|PREef',
            'PREab^|#PREcd|PREef',
            TextSelModifyImpl.changeTextToggleLinePrefix,
            'PRE',
            defFont
        );
        testChangeText(
            `PREab|^cd|${c}${defFont}${c}PRE#`,
            'PREab|PREcd#|^',
            TextSelModifyImpl.changeTextToggleLinePrefix,
            'PRE',
            defFont
        );
        testChangeText(
            `PREab|PREcd|^${c}${defFont}${c}PRE#`,
            'PREab|PREcd|^#',
            TextSelModifyImpl.changeTextToggleLinePrefix,
            'PRE',
            defFont
        );
    },
    'testchangeTextDeleteLine',
    () => {
        testChangeText('^#', '^#', TextSelModifyImpl.changeTextDeleteLine);
        testChangeText('^#', 'abc^#', TextSelModifyImpl.changeTextDeleteLine);
        testChangeText('^#', 'a^b#c', TextSelModifyImpl.changeTextDeleteLine);
        testChangeText('^#cd|ef', 'ab^#|cd|ef', TextSelModifyImpl.changeTextDeleteLine);
        testChangeText('^#cd|ef', '^ab#|cd|ef', TextSelModifyImpl.changeTextDeleteLine);
        testChangeText('^#cd|ef', 'ab^|cd#|ef', TextSelModifyImpl.changeTextDeleteLine);
        testChangeText('ab|^#ef', 'ab|cd^#|ef', TextSelModifyImpl.changeTextDeleteLine);
        testChangeText('ab|^#ef', 'ab|^cd#|ef', TextSelModifyImpl.changeTextDeleteLine);
        testChangeText('ab|^#ef', 'ab|cd^|ef#', TextSelModifyImpl.changeTextDeleteLine);
        testChangeText('ab|cd|^#', 'ab|cd|ef^#', TextSelModifyImpl.changeTextDeleteLine);
        testChangeText('ab|cd|^#', 'ab|cd|^ef#', TextSelModifyImpl.changeTextDeleteLine);
        testChangeText('ab|cd|^#', 'ab|cd#|ef^', TextSelModifyImpl.changeTextDeleteLine);
    },
    'testchangeTextBackspace.DeleteToTheLeft',
    () => {
        testChangeText('^#abc', '^#abc', TextSelModifyImpl.changeTextBackspace, true, false);
        testChangeText('^#bc', 'a^#bc', TextSelModifyImpl.changeTextBackspace, true, false);
        testChangeText('a^#c', 'ab^#c', TextSelModifyImpl.changeTextBackspace, true, false);
        testChangeText('ab^#', 'abc^#', TextSelModifyImpl.changeTextBackspace, true, false);
    },
    'testchangeTextBackspace.DeleteToTheRight',
    () => {
        testChangeText('^#bc', '^#abc', TextSelModifyImpl.changeTextBackspace, false, false);
        testChangeText('a^#c', 'a^#bc', TextSelModifyImpl.changeTextBackspace, false, false);
        testChangeText('ab^#', 'ab^#c', TextSelModifyImpl.changeTextBackspace, false, false);
        testChangeText('abc^#', 'abc^#', TextSelModifyImpl.changeTextBackspace, false, false);
    },
    'testchangeTextBackspace.DeleteSelectionWithBackspaceKey',
    () => {
        testChangeText('a^#d', 'a^bc#d', TextSelModifyImpl.changeTextBackspace, true, false);
        testChangeText('a^#d', 'a#bc^d', TextSelModifyImpl.changeTextBackspace, true, false);
        testChangeText('^#d', '^abc#d', TextSelModifyImpl.changeTextBackspace, true, false);
        testChangeText('a^#', 'a^bcd#', TextSelModifyImpl.changeTextBackspace, true, false);
        testChangeText('^#', '^abcd#', TextSelModifyImpl.changeTextBackspace, true, false);
        testChangeText('^#', '^#', TextSelModifyImpl.changeTextBackspace, true, false);
    },
    'testchangeTextBackspace.DeleteSelectionWithDeleteKey',
    () => {
        testChangeText('a^#d', 'a^bc#d', TextSelModifyImpl.changeTextBackspace, false, false);
        testChangeText('a^#d', 'a#bc^d', TextSelModifyImpl.changeTextBackspace, false, false);
        testChangeText('^#d', '^abc#d', TextSelModifyImpl.changeTextBackspace, false, false);
        testChangeText('a^#', 'a^bcd#', TextSelModifyImpl.changeTextBackspace, false, false);
        testChangeText('^#', '^abcd#', TextSelModifyImpl.changeTextBackspace, false, false);
        testChangeText('^#', '^#', TextSelModifyImpl.changeTextBackspace, false, false);
    },
    'testchangeTextInsert.TypeCharacters',
    () => {
        testChangeText('1^#abc', '^#abc', TextSelModifyImpl.changeTextInsert, '1', defFont);
        testChangeText('123^#abc', '^#abc', TextSelModifyImpl.changeTextInsert, '123', defFont);
        testChangeText('a123^#bc', 'a^#bc', TextSelModifyImpl.changeTextInsert, '123', defFont);
        testChangeText('ab123^#c', 'ab^#c', TextSelModifyImpl.changeTextInsert, '123', defFont);
        testChangeText('abc123^#', 'abc^#', TextSelModifyImpl.changeTextInsert, '123', defFont);
    },
    'testchangeTextInsert.TypeCharactersAndReplaceExisting',
    () => {
        testChangeText('a123^#d', 'a^bc#d', TextSelModifyImpl.changeTextInsert, '123', defFont);
        testChangeText('a123^#d', 'a#bc^d', TextSelModifyImpl.changeTextInsert, '123', defFont);
        testChangeText('123^#d', '^abc#d', TextSelModifyImpl.changeTextInsert, '123', defFont);
        testChangeText('a123^#', 'a^bcd#', TextSelModifyImpl.changeTextInsert, '123', defFont);
        testChangeText('123^#', '^abcd#', TextSelModifyImpl.changeTextInsert, '123', defFont);
    },
    'testchangeTextInsert.TypeCharactersShouldUseDefaultFontIfAnEmptyField',
    () => {
        let c = specialCharFontChange;
        testChangeText(`${c}${defFont}${c}123^#`, '^#', TextSelModifyImpl.changeTextInsert, '123', defFont);
    },
    'testchangeTextInsert.TypedCharactersShouldMatchAdjacentFont',
    () => {
        let style = textFontStylingToString(TextFontStyling.Default);
        let c = specialCharFontChange;
        testChangeText(
            `${c}courier_1_${style}${c}ABC^#a${c}courier_2_${style}${c}b${c}courier_3_${style}${c}c`,
            `^#${c}courier_1_${style}${c}a${c}courier_2_${style}${c}b${c}courier_3_${style}${c}c`,
            TextSelModifyImpl.changeTextInsert,
            'ABC',
            defFont
        );
        testChangeText(
            `${c}courier_1_${style}${c}aABC^#${c}courier_2_${style}${c}b${c}courier_3_${style}${c}c`,
            `${c}courier_1_${style}${c}a${c}courier_2_${style}${c}^#b${c}courier_3_${style}${c}c`,
            TextSelModifyImpl.changeTextInsert,
            'ABC',
            defFont
        );
        testChangeText(
            `${c}courier_1_${style}${c}a${c}courier_2_${style}${c}bABC^#${c}courier_3_${style}${c}c`,
            `${c}courier_1_${style}${c}a${c}courier_2_${style}${c}b${c}courier_3_${style}${c}^#c`,
            TextSelModifyImpl.changeTextInsert,
            'ABC',
            defFont
        );
        testChangeText(
            `${c}courier_1_${style}${c}a${c}courier_2_${style}${c}b${c}courier_3_${style}${c}cABC^#`,
            `${c}courier_1_${style}${c}a${c}courier_2_${style}${c}b${c}courier_3_${style}${c}c^#`,
            TextSelModifyImpl.changeTextInsert,
            'ABC',
            defFont
        );
    }
];

/**
 * exported test class for mTests
 */
export class TestUI512SelAndEntry extends UI512TestBase {
    tests = mTests;
}

/**
 * run fromPlainText to get the selcaret and selend markers,
 * then run the callback with the provided args,
 * then compare expected and received results
 */
function testChangeText(expected: string, input: string, fn: Function, ...moreargs: any[]) {
    expected = expected.replace(/\|/g, '\n');
    input = input.replace(/\|/g, '\n');
    let [t, selcaret, selend] = TestUI512TextSelectEvents.fromPlainText(input);
    let args = [t, selcaret, selend, ...moreargs];
    let [gotTxt, gotSelCaret, gotSelEnd] = fn.apply(null, args);
    let [expectedTxt, expectedCaret, expectedEnd] = TestUI512TextSelectEvents.fromPlainText(expected);
    assertEq(expectedTxt.toSerialized(), gotTxt.toSerialized(), '1p|');
    assertEq(expectedCaret, gotSelCaret, '1o|ncorrect caret position');
    assertEq(expectedEnd, gotSelEnd, '1n|incorrect select-end position');
}

/**
 * used in tests only, not visible from product code
 */
let defFont = 'geneva_18_' + textFontStylingToString(TextFontStyling.Default);
