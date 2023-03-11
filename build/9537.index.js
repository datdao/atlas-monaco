/*!
 * 
 *   @hodgef/js-library-boilerplate-basic v1.6.164
 *   https://github.com/hodgef/js-library-boilerplate-basic
 *
 *   Copyright (c) Francisco Hodge (https://github.com/hodgef) and project contributors.
 *
 *   This source code is licensed under the MIT license found in the
 *   LICENSE file in the root directory of this source tree.
 *
 */
"use strict";(self.webpackChunkMyLibrary=self.webpackChunkMyLibrary||[]).push([[9537],{9537:(e,n,o)=>{o.r(n),o.d(n,{conf:()=>t,language:()=>s});
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.36.1(6c56744c3419458f0dd48864520b759d1a3a1ca8)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var t={comments:{lineComment:"//",blockComment:["/*","*/"]},brackets:[["{","}"],["[","]"],["(",")"]],autoClosingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'},{open:"'",close:"'"}],surroundingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'},{open:"'",close:"'"}]},s={defaultToken:"",tokenPostfix:".objective-c",keywords:["#import","#include","#define","#else","#endif","#if","#ifdef","#ifndef","#ident","#undef","@class","@defs","@dynamic","@encode","@end","@implementation","@interface","@package","@private","@protected","@property","@protocol","@public","@selector","@synthesize","__declspec","assign","auto","BOOL","break","bycopy","byref","case","char","Class","const","copy","continue","default","do","double","else","enum","extern","FALSE","false","float","for","goto","if","in","int","id","inout","IMP","long","nil","nonatomic","NULL","oneway","out","private","public","protected","readwrite","readonly","register","return","SEL","self","short","signed","sizeof","static","struct","super","switch","typedef","TRUE","true","union","unsigned","volatile","void","while"],decpart:/\d(_?\d)*/,decimal:/0|@decpart/,tokenizer:{root:[{include:"@comments"},{include:"@whitespace"},{include:"@numbers"},{include:"@strings"},[/[,:;]/,"delimiter"],[/[{}\[\]()<>]/,"@brackets"],[/[a-zA-Z@#]\w*/,{cases:{"@keywords":"keyword","@default":"identifier"}}],[/[<>=\\+\\-\\*\\/\\^\\|\\~,]|and\\b|or\\b|not\\b]/,"operator"]],whitespace:[[/\s+/,"white"]],comments:[["\\/\\*","comment","@comment"],["\\/\\/+.*","comment"]],comment:[["\\*\\/","comment","@pop"],[".","comment"]],numbers:[[/0[xX][0-9a-fA-F]*(_?[0-9a-fA-F])*/,"number.hex"],[/@decimal((\.@decpart)?([eE][\-+]?@decpart)?)[fF]*/,{cases:{"(\\d)*":"number",$0:"number.float"}}]],strings:[[/'$/,"string.escape","@popall"],[/'/,"string.escape","@stringBody"],[/"$/,"string.escape","@popall"],[/"/,"string.escape","@dblStringBody"]],stringBody:[[/[^\\']+$/,"string","@popall"],[/[^\\']+/,"string"],[/\\./,"string"],[/'/,"string.escape","@popall"],[/\\$/,"string"]],dblStringBody:[[/[^\\"]+$/,"string","@popall"],[/[^\\"]+/,"string"],[/\\./,"string"],[/"/,"string.escape","@popall"],[/\\$/,"string"]]}}}}]);
//# sourceMappingURL=9537.index.js.map