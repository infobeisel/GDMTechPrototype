function keyboard(value) {
	// list of keys: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
	let key = {};
	key.value = value;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;
	// downHandler
	key.downHandler = event => {
		if (event.key === key.value) {
			if (key.isUp && key.press){
				key.press();
				key.isDown = true;
				key.isUp = false;
			}
			event.preventDefault();
			// do not prevent default so that it scrolls into the hidden parts of the map (event.preventDefault();)
		}
	};

	// upHandler
	key.upHandler = event => {
		if (event.key === key.value) {
			if (key.isDown && key.release){
				key.release();
				key.isDown = false;
				key.isUp = true;
			}
			event.preventDefault();
			// do not prevent default so that it scrolls into the hidden parts of the map (event.preventDefault();)
		}
	};

	//Attach event listeners
	const downListener = key.downHandler.bind(key);
	const upListener = key.upHandler.bind(key);
	
	window.addEventListener(
		"keydown", downListener, false
	);
	window.addEventListener(
		"keyup", upListener, false
	);
	
	// Detach event listeners
	key.unsubscribe = () => {
		window.removeEventListener("keydown", downListener);
		window.removeEventListener("keyup", upListener);
	};
	return key;
}

function getRandomArbitraryFloat(min, max) {
	return Math.random() * (max - min) + min;
}

function getRandomArbitraryInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getIntLength(x) {
	return Math.max(Math.floor(Math.log10(Math.abs(x))), 0) + 1;
}

function populatedArray(array) {
	return (array !== undefined && array.length !== 0);
}

function functionScopePreserver(context=undefined, funcName, argsList=undefined) {
	// yes, I indeed was inspired
	return function () {
		let eval_string = "";
		if (context !== undefined) {
			eval_string += "context.";
		}

		eval_string += funcName;

		if (argsList !== undefined) {
			eval_string += "(";
			for (var i = 0; i < argsList.length; i++) {
				eval_string += "argsList[" + i + "]";
				if (i !== argsList.length-1) {
					eval_string += ",";
				}
			}
			eval_string += ")";
		}

		eval(eval_string);
	};
}

export {keyboard, getRandomArbitraryFloat, getRandomArbitraryInt, getIntLength, populatedArray, functionScopePreserver};