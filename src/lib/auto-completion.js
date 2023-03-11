import { sql } from "./data/sql";
import { getWordRange, getParentResource, getParentResources, globalSearch } from "./utils";
import * as monaco from 'monaco-editor';


// Get Competion items for monaco editor resgiter
export function getCompletionItems(sqlDialect) {
	const hclObject = sql[sqlDialect]
	var completionItems = buildCompletionItems(hclObject)

    return {
		triggerCharacters: ["."],
        provideCompletionItems: function (model, position, context) {
			
			var resources = getParentResources(model, position, Object.keys(hclObject))
			var range = getWordRange(model, position)

			// References feature
			if(context.triggerKind == 1 && context.triggerCharacter == ".") {
				// globalSearch(model.getValue(), ['schema'])
				return {
					suggestions: globalSearchCompletionItem(model, position)
				}
			}

            return {
                suggestions: completionItems.filter((compeltionItem) => {
					return compeltionItem(range, resources) !== undefined
				}).map((compeltionItem) => {
					 return compeltionItem(range, resources)
				}),
            };
        },
    };
}

// Recursion function to get completion items
function buildCompletionItems(hclObject, pointers = []) {
	let completionItems = []

	if (hclObject == undefined) {
		return completionItems
	}

	Object.entries(hclObject).forEach(([key, value]) => {
		const pointersClone = [...pointers]
		pointers.push(key)
		
		if (Object.prototype.toString.call(value) === '[object Object]') {

			// Push Resource completion Items
			completionItems.push((range, resources) => {
				return isValidTree(resources, pointersClone) ? buildResourceCompletionTemplate(range, key) : undefined
			})
			
			// [IMPORTANT] trigger recursion
			completionItems.push(...buildCompletionItems(value, pointers))
			pointers.pop(key)

			return completionItems
		}

		// Push Attribute completion Items
		completionItems.push((range, resources) => { 
			return isValidTree(resources, pointersClone) ? buildAttrCompletionTemplate(range, key) : undefined
		})

		// Push Value completion Items
		if (Object.prototype.toString.call(value) === '[object Array]') {
			
			var pointersClone2 = [...pointers]
			Object.entries(value).forEach(([k, v]) => {
				completionItems.push((range, resources) => { 
					return isValidTree(resources, pointersClone2) ? buildValueCompletionTemplate(range, v) : undefined
				})
			})
		}

		pointers.pop(key)



	});

	return completionItems
}

// Resource template
function buildResourceCompletionTemplate(range, key) {
	return {
		label: key,
		kind: monaco.languages.CompletionItemKind.Method,
		detail: "",
		insertText: key + ' "${1}" {\n\t${0}\n}',
		insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
		range: range,
	}
}

// Resource template
function buildReferenceCompletionTemplate(range, key) {
	return {
		label: key,
		kind: monaco.languages.CompletionItemKind.Method,
		detail: "",
		insertText: key,
		insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
		range: range,
	}
}

// Attribute template
function buildAttrCompletionTemplate(range, key) {
	return {
		label: key,
		kind: monaco.languages.CompletionItemKind.Variable,
		insertText: key + ' = ${0}',
		insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
		range: range,
	}
}

// Value template
function buildValueCompletionTemplate(range, key) {
	return {
		label: key,
		kind: monaco.languages.CompletionItemKind.Variable,
		insertText: key + '\n${0}',
		insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
		range: range,
	}
}

function isValidTree(resources, pointers) {	
	if (resources.length != pointers.length) {
		return false
	}

	for (let i = 0; i < resources.length; i++) {
		if (resources[i].resource !== pointers[i]) {
			return false;
		}
	}
	return true
} 

const regex = /(?:[\s|.])(\w+)/g
function globalSearchCompletionItem(textModel, position) {
	const wordRange = textModel.getLineContent(position.lineNumber);
	let completionItems = []
	let values = []
	var range = getWordRange(textModel, position)

	let match;
	while ((match = regex.exec(wordRange)) !== null) {
		values.push(match[1])
	}
	console.log(values)
	var suggestions = globalSearch(textModel,values, position)
	suggestions.forEach((v) => {
		completionItems.push(
			buildReferenceCompletionTemplate(range, v)
		)
	})

	return completionItems
}

function isTriggerGlobalSearch(textModel, position) {

}