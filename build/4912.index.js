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
"use strict";(self.webpackChunkMyLibrary=self.webpackChunkMyLibrary||[]).push([[4912],{4912:(e,t,i)=>{i.r(t),i.d(t,{conf:()=>o,language:()=>n});
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.36.1(6c56744c3419458f0dd48864520b759d1a3a1ca8)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var o={comments:{lineComment:"COMMENT"},brackets:[["(",")"]],autoClosingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'},{open:":",close:"."}],surroundingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:"`",close:"`"},{open:'"',close:'"'},{open:"'",close:"'"},{open:":",close:"."}],folding:{markers:{start:new RegExp("^\\s*(::\\s*|COMMENT\\s+)#region"),end:new RegExp("^\\s*(::\\s*|COMMENT\\s+)#endregion")}}},n={tokenPostfix:".lexon",ignoreCase:!0,keywords:["lexon","lex","clause","terms","contracts","may","pay","pays","appoints","into","to"],typeKeywords:["amount","person","key","time","date","asset","text"],operators:["less","greater","equal","le","gt","or","and","add","added","subtract","subtracted","multiply","multiplied","times","divide","divided","is","be","certified"],symbols:/[=><!~?:&|+\-*\/\^%]+/,tokenizer:{root:[[/^(\s*)(comment:?(?:\s.*|))$/,["","comment"]],[/"/,{token:"identifier.quote",bracket:"@open",next:"@quoted_identifier"}],["LEX$",{token:"keyword",bracket:"@open",next:"@identifier_until_period"}],["LEXON",{token:"keyword",bracket:"@open",next:"@semver"}],[":",{token:"delimiter",bracket:"@open",next:"@identifier_until_period"}],[/[a-z_$][\w$]*/,{cases:{"@operators":"operator","@typeKeywords":"keyword.type","@keywords":"keyword","@default":"identifier"}}],{include:"@whitespace"},[/[{}()\[\]]/,"@brackets"],[/[<>](?!@symbols)/,"@brackets"],[/@symbols/,"delimiter"],[/\d*\.\d*\.\d*/,"number.semver"],[/\d*\.\d+([eE][\-+]?\d+)?/,"number.float"],[/0[xX][0-9a-fA-F]+/,"number.hex"],[/\d+/,"number"],[/[;,.]/,"delimiter"]],quoted_identifier:[[/[^\\"]+/,"identifier"],[/"/,{token:"identifier.quote",bracket:"@close",next:"@pop"}]],space_identifier_until_period:[[":","delimiter"],[" ",{token:"white",next:"@identifier_rest"}]],identifier_until_period:[{include:"@whitespace"},[":",{token:"delimiter",next:"@identifier_rest"}],[/[^\\.]+/,"identifier"],[/\./,{token:"delimiter",bracket:"@close",next:"@pop"}]],identifier_rest:[[/[^\\.]+/,"identifier"],[/\./,{token:"delimiter",bracket:"@close",next:"@pop"}]],semver:[{include:"@whitespace"},[":","delimiter"],[/\d*\.\d*\.\d*/,{token:"number.semver",bracket:"@close",next:"@pop"}]],whitespace:[[/[ \t\r\n]+/,"white"]]}}}}]);
//# sourceMappingURL=4912.index.js.map