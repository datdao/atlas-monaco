/*!
 * 
 *   @datdao/atlas-monaco v1.0
 *   https://github.com/hodgef/ts-library-boilerplate-basic
 *
 *   Copyright (c) Dat Dao (https://github.com/datdao) and project contributors.
 *
 *   This source code is licensed under the MIT license found in the
 *   LICENSE file in the root directory of this source tree.
 *
 */
"use strict";(self.webpackChunkMyLibrary=self.webpackChunkMyLibrary||[]).push([[4188],{4188:(e,o,n)=>{n.r(o),n.d(o,{conf:()=>s,language:()=>t});
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.36.1(6c56744c3419458f0dd48864520b759d1a3a1ca8)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var s={comments:{blockComment:["/*","*/"],lineComment:"//"},brackets:[["{","}"],["[","]"],["(",")"]],autoClosingPairs:[{open:"{",close:"}",notIn:["string"]},{open:"[",close:"]",notIn:["string"]},{open:"(",close:")",notIn:["string"]},{open:'"',close:'"',notIn:["string"]},{open:"'",close:"'",notIn:["string"]}],surroundingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'},{open:"'",close:"'"},{open:"<",close:">"}]},t={defaultToken:"",tokenPostfix:".flow",keywords:["import","require","export","forbid","native","if","else","cast","unsafe","switch","default"],types:["io","mutable","bool","int","double","string","flow","void","ref","true","false","with"],operators:["=",">","<","<=",">=","==","!","!=",":=","::=","&&","||","+","-","*","/","@","&","%",":","->","\\","$","??","^"],symbols:/[@$=><!~?:&|+\-*\\\/\^%]+/,escapes:/\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,tokenizer:{root:[[/[a-zA-Z_]\w*/,{cases:{"@keywords":"keyword","@types":"type","@default":"identifier"}}],{include:"@whitespace"},[/[{}()\[\]]/,"delimiter"],[/[<>](?!@symbols)/,"delimiter"],[/@symbols/,{cases:{"@operators":"delimiter","@default":""}}],[/((0(x|X)[0-9a-fA-F]*)|(([0-9]+\.?[0-9]*)|(\.[0-9]+))((e|E)(\+|-)?[0-9]+)?)/,"number"],[/[;,.]/,"delimiter"],[/"([^"\\]|\\.)*$/,"string.invalid"],[/"/,"string","@string"]],whitespace:[[/[ \t\r\n]+/,""],[/\/\*/,"comment","@comment"],[/\/\/.*$/,"comment"]],comment:[[/[^\/*]+/,"comment"],[/\*\//,"comment","@pop"],[/[\/*]/,"comment"]],string:[[/[^\\"]+/,"string"],[/@escapes/,"string.escape"],[/\\./,"string.escape.invalid"],[/"/,"string","@pop"]]}}}}]);
//# sourceMappingURL=4188.index.js.map