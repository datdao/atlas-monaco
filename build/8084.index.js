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
"use strict";(self.webpackChunkMyLibrary=self.webpackChunkMyLibrary||[]).push([[8084],{8084:(e,o,n)=>{n.r(o),n.d(o,{conf:()=>t,language:()=>s});
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.36.1(6c56744c3419458f0dd48864520b759d1a3a1ca8)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var t={comments:{lineComment:"//",blockComment:["(*","*)"]},brackets:[["{","}"],["[","]"],["(",")"],["<",">"]],autoClosingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:"<",close:">"},{open:"'",close:"'"}],surroundingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:"<",close:">"},{open:"'",close:"'"}]},s={defaultToken:"",tokenPostfix:".pascaligo",ignoreCase:!0,brackets:[{open:"{",close:"}",token:"delimiter.curly"},{open:"[",close:"]",token:"delimiter.square"},{open:"(",close:")",token:"delimiter.parenthesis"},{open:"<",close:">",token:"delimiter.angle"}],keywords:["begin","block","case","const","else","end","fail","for","from","function","if","is","nil","of","remove","return","skip","then","type","var","while","with","option","None","transaction"],typeKeywords:["bool","int","list","map","nat","record","string","unit","address","map","mtz","xtz"],operators:["=",">","<","<=",">=","<>",":",":=","and","mod","or","+","-","*","/","@","&","^","%"],symbols:/[=><:@\^&|+\-*\/\^%]+/,tokenizer:{root:[[/[a-zA-Z_][\w]*/,{cases:{"@keywords":{token:"keyword.$0"},"@default":"identifier"}}],{include:"@whitespace"},[/[{}()\[\]]/,"@brackets"],[/[<>](?!@symbols)/,"@brackets"],[/@symbols/,{cases:{"@operators":"delimiter","@default":""}}],[/\d*\.\d+([eE][\-+]?\d+)?/,"number.float"],[/\$[0-9a-fA-F]{1,16}/,"number.hex"],[/\d+/,"number"],[/[;,.]/,"delimiter"],[/'([^'\\]|\\.)*$/,"string.invalid"],[/'/,"string","@string"],[/'[^\\']'/,"string"],[/'/,"string.invalid"],[/\#\d+/,"string"]],comment:[[/[^\(\*]+/,"comment"],[/\*\)/,"comment","@pop"],[/\(\*/,"comment"]],string:[[/[^\\']+/,"string"],[/\\./,"string.escape.invalid"],[/'/,{token:"string.quote",bracket:"@close",next:"@pop"}]],whitespace:[[/[ \t\r\n]+/,"white"],[/\(\*/,"comment","@comment"],[/\/\/.*$/,"comment"]]}}}}]);
//# sourceMappingURL=8084.index.js.map